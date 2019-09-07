import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  //Tell parent component to hide this component when OKR is saved
  @Output() hide = new EventEmitter<boolean>();

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
  keyResults: KeyResult[];

  noObjective: boolean;

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  // Push a owner search term into the observable stream.
  ownerSearch(term: string): void {
    this.ownerSearchTerms.next(term);
    console.log('Searching for owner', term);
  }

  // Push a parent OKR search term into the observable stream.
  parentSearch(term: string): void {
    this.parentSearchTerms.next(term);
    console.log('Searching for parent', term);
  }

  ngOnInit() {
    this.objective = '';
    this.noObjective = false;
    let krCount = 1;
    this.keyResults = [];
    for (let i = 0; i < krCount; i++) {
      this.keyResults.push(new KeyResult(''));
    }
    this.okr = new Okr(this.objective, this.keyResults);
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

  getParent(){
    let parentId = this.route.snapshot.paramMap.get('parent');
    if(parentId){
      this.okrService.getOkr(parentId)
        .subscribe((okr: Okr) => {
          this.parent = okr;
        });
    }
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
      this.noObjective = true;
      return;
    } else {
      this.okrService.createOkr(this.okr)
        .subscribe((okr: Okr) => {
          if(okr.parent){
            this.addToParentOnSave(okr.parent, okr._id, ()=>{
              this.hideNew();
            });
            console.log(`adding child with id ${okr._id} to parent w id ${this.okr.parent}`);
          }else{
            this.hideNew();
          }
        });
    }
  }

  addToParentOnSave(parentId: string, childId: string, cb: () => void): void{
    this.okrService.addChild(parentId, childId)
      .subscribe(()=>{
        console.log('Added child to parent');
        cb();
      });
  }

  assign(owner: UserDetails): void{
    this.okr.userId = owner._id;
    this.owner = owner;
    console.log(`Assigning ${owner.name} as owner`);
    this.ownerSearch('');
  }

  link(parent: Okr): void{
    this.okr.parent = parent._id;
    this.parent = parent;
    console.log(`Linking to parent with objective ${parent.objective}`);
    this.parentSearch('');
  }  
}
