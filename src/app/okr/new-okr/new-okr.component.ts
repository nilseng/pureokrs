import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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
  faPlusCircle = faPlusCircle;
  faTrashAlt = faTrashAlt;

  @Input() parentId: string;
  @Output() savedOkr = new EventEmitter<Okr>();

  okr: Okr;
  krCount: number;

  noObjective: boolean;

  //Variables for searching for OKR owner
  users$: Observable<{}>;
  private ownerSearchTerms = new Subject<string>();
  owner: UserDetails;

  //Variables for searching for OKR parent
  parents$: Observable<{}>;
  private parentSearchTerms = new Subject<string>();
  parent: Okr;

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
    this.okr = new Okr('');
    this.okr.keyResults.push(new KeyResult(''));
    this.okr.userId = this.auth.getUserDetails()._id;
    this.owner = this.auth.getUserDetails();
    this.getParent();

    this.noObjective = false;

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
    this.getParent();
  }

  save(): void {
    if (!this.okr.objective.trim()) {
      this.noObjective = true;
      return;
    } else {
      this.okrService.createOkr(this.okr)
        .subscribe((okr: Okr) => {
          if (okr.parent) {
            this.addToParentOnSave(okr);
          } else {
            this.savedOkr.emit(okr);
          }
          this.clearForm();
        });
    }
  }

  getParent() {
    if (this.parentId) {
      this.okrService.getOkr(this.parentId)
        .subscribe((okr: Okr) => {
          this.parent = okr;
          this.okr.parent = okr._id;
        });
    }
  }

  addKeyResult(): void {
    this.okr.keyResults.push(new KeyResult(''));
  }

  removeKeyResult(id: string, index: number): void {
    this.okr.keyResults.splice(index, 1);
  }

  addToParentOnSave(okr: Okr) {
    this.okrService.addChild(okr.parent, okr._id)
      .subscribe(() => {
        this.savedOkr.emit(okr);
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
    this.okr = new Okr('');
    this.okr.objective = '';
    this.okr.keyResults = []
    this.okr.keyResults.push(new KeyResult(''));
    this.okr.userId = this.auth.getUserDetails()._id;
    this.owner = this.auth.getUserDetails();
    this.parent = undefined;
    this.noObjective = false;
  }
}
