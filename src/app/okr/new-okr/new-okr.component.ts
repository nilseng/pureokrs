import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Okr, KeyResult } from '../okr';
import { OkrService } from '../../okr.service';
import { AuthenticationService, UserDetails } from '../../authentication.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-new-okr',
  templateUrl: './new-okr.component.html',
  styleUrls: ['./new-okr.component.css']
})
export class NewOkrComponent implements OnInit, OnChanges {
  @Input() parentId: string;
  @Output() savedOkr = new EventEmitter<Okr>();
  @Output() clearP = new EventEmitter();

  @ViewChild('openModal') openModal: ElementRef;

  //Variables for searching for OKR owner
  users$: Observable<{}>;
  private ownerSearchTerms = new Subject<string>();
  owner: UserDetails;

  //Variables for searching for OKR parent
  parents$: Observable<{}>;
  private parentSearchTerms = new Subject<string>();
  parent: Okr;

  okr: Okr;
  objective: string;
  keyResults: KeyResult[] = [];
  krCount: number;

  noObjective: boolean;

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // Push a owner search term into the observable stream.
  ownerSearch(term: string): void {
    this.ownerSearchTerms.next(term);
  }

  // Push a parent OKR search term into the observable stream.
  parentSearch(term: string): void {
    this.parentSearchTerms.next(term);
  }

  ngOnInit() {
    this.objective = '';
    this.noObjective = false;
    this.krCount = 1;
    this.keyResults.push(new KeyResult(''));
    this.okr = new Okr(this.objective);
    this.okr.userId = this.auth.getUserDetails()._id;

    this.owner = this.auth.getUserDetails();

    this.getParent();

    this.users$ = this.ownerSearchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.searchUsers(term)),
    );

    this.parents$ = this.parentSearchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.okrService.searchOkrs(term)),
    );
  }

  ngOnChanges() {
    if (!!this.parentId) {
      this.getParent();
    }
  }

  getParent() {
    if(this.parentId){
      this.okrService.getOkr(this.parentId)
      .subscribe((okr: Okr) => {
        this.parent = okr;
        this.okr.parent = okr._id;
      });
    }
  }

  clearParent(){
    this.parent = undefined;
    this.clearP.emit();
  }

  addKeyResult(): void {
    let kr = new KeyResult('');
    this.keyResults[this.krCount] = kr;
    this.krCount++;
  }

  removeKeyResult(id: string, index: number): void {
    delete this.keyResults[index];
    this.okr.keyResults = this.okr.keyResults.filter(e => e._id !== id);
  }

  save(): void {
    if (!this.okr.objective.trim()) {
      this.noObjective = true;
      return;
    } else {
      this.okrService.createOkr(this.okr, this.keyResults)
        .subscribe((okr: Okr) => {
          if (!okr) {
            //Something went wrong went creating the OKR
          } else if (okr.parent) {
            this.addToParentOnSave(okr.parent, okr._id, () => { });
            this.savedOkr.emit(okr);
          } else {
            this.savedOkr.emit(okr);
            this.clearForm();
          }
        });
    }
  }

  addToParentOnSave(parentId: string, childId: string, cb: () => void): void {
    this.okrService.addChild(parentId, childId)
      .subscribe(() => {
        cb();
      });
  }

  assign(owner: UserDetails): void {
    this.okr.userId = owner._id;
    this.owner = owner;
    this.ownerSearch('');
  }

  link(parent: Okr): void {
    this.okr.parent = parent._id;
    this.parent = parent;
    this.parentSearch('');
  }

  clearForm() {
    this.objective = '';
    this.noObjective = false;
    this.krCount = 1;
    this.keyResults = []
    this.keyResults.push(new KeyResult(''));
    this.okr = new Okr(this.objective);
    this.okr.userId = this.auth.getUserDetails()._id;

    this.owner = this.auth.getUserDetails();

    this.getParent();
  }
}
