import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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

  okr: Okr;

  noObjective: boolean;

  users$: Observable<{}>;
  private ownerSearchTerms = new Subject<string>();
  owner: UserDetails;

  parents$: Observable<{}>;
  private parentSearchTerms = new Subject<string>();
  parent: Okr;

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ownerSearch(term: string): void {
    this.ownerSearchTerms.next(term);
  }

  parentSearch(term: string): void {
    this.parentSearchTerms.next(term);
    console.log('Searching for parent', term);
  }

  ngOnInit() {
    this.noObjective = false;
    this.getOkr();

    this.parent = new Okr('', []);

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

  getOkr(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.okrService.getOkr(id)
      .subscribe(okr => {
        this.okr = okr;
        if (this.okr.parent) {
          this.okrService.getOkr(this.okr.parent)
            .subscribe(parent => this.parent = parent);
        }
        if (this.okr.userId) {
          this.userService.getUser(this.okr.userId)
            .subscribe(owner => this.owner = owner);
        }
      });
  }

  addKeyResult(): void {
    this.okr.keyResults.push(new KeyResult(''));
  }

  removeKeyResult(index: number): void {
    this.okr.keyResults = this.okr.keyResults
      .filter(kr => this.okr.keyResults.indexOf(kr) !== index);
  }

  save(): void {
    if (!this.okr.objective.trim()) {
      this.noObjective = true;
      return;
    } else {
      this.okrService.updateOkr(this.okr)
        .subscribe((okr: Okr) => {
          if (okr.parent) {
            this.addToParent(okr.parent, okr._id);
          } else {
            this.router.navigate(['company/okrs']);
          }
        });
    }
  }

  addToParent(parentId: string, childId: string): void {
    this.okrService.addChild(parentId, childId)
      .subscribe(() => {
        this.router.navigate(['company/okrs']);
      });
  }

  assign(owner: UserDetails): void {
    this.owner = owner;
    this.okr.userId = owner._id;
    this.ownerSearch('');
  }

  link(parent: Okr): void {
    this.okr.parent = parent._id;
    this.parent = parent;
    this.parentSearch('');
  }
}