import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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
export class NewOkrComponent implements OnInit {

  @Output() hide = new EventEmitter<boolean>();

  users$: Observable<{}>;
  private searchTerms = new Subject<string>();

  okr: Okr;
  objective: string;
  keyResults: KeyResult[];

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) { }
  
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
    console.log('Searching for', term);
  }

  ngOnInit() {
    this.objective = '';
    let krCount = 1;
    this.keyResults = [];
    for (let i = 0; i < krCount; i++) {
      this.keyResults.push(new KeyResult(''));
    }
    this.okr = new Okr(this.objective, this.keyResults)

    this.users$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.searchUsers(term)),
    );
  }

  addKeyResult(): void {
    this.okr.keyResults.push(new KeyResult(''));
  }

  removeKeyResult(): void {
    this.okr.keyResults.pop();
  }

  hideNew(): void {
    this.hide.emit(true);
  }

  save(): void {
    if (!this.okr.objective.trim()) {
      return;
    } else {
      if (this.okr.parent) {
        console.log('OKR has parent');
        //TODO: Add OKR to parent by id
        //this.okr.parent.children.push(this.okr._id);
      }
      this.okrService.createOkr(this.okr)
        .subscribe(() => this.hideNew());
    }
  }

  assign(ownerId: string): void{
    this.okr.userId = ownerId;
    console.log(`Assigning owner w id=${ownerId}`);
  }
}
