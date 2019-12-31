import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {faPlusCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

import { Okr, KeyResult } from '../okr';
import { OkrService } from '../../okr.service';
import { AuthenticationService, UserDetails } from '../../authentication.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-edit-okr',
  templateUrl: './edit-okr.component.html',
  styleUrls: ['./edit-okr.component.css']
})
export class EditOkrComponent implements OnInit {

  faPlusCircle = faPlusCircle;
  faTrashAlt = faTrashAlt;

  @Input() okr: Okr;
  @Output() savedOkr = new EventEmitter<Okr>();
  @Output() clearP = new EventEmitter();

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
    this.userService.getUser(this.okr.userId)
      .subscribe(owner => this.owner = owner);
    this.getParent();
  }

  save(): void {
    if (!this.okr.objective.trim()) {
      this.noObjective = true;
      return;
    } else {
      this.okrService.updateOkr(this.okr)
        .subscribe((okr: Okr) => {
          this.clearForm();
          this.savedOkr.emit(okr);
        });
    }
  }

  getParent() {
    if (this.okr.parent) {
      this.okrService.getOkr(this.okr.parent)
        .subscribe((okr: Okr) => {
          this.parent = okr;
          this.okr.parent = okr._id;
        });
    }
  }

  clearParent() {
    this.parent = undefined;
    this.clearP.emit();
  }

  addKeyResult(): void {
    this.okr.keyResults.push(new KeyResult(''));
  }

  removeKeyResult(index: number): void {
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