import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

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
  keyResults: {};
  krCount: number;

  noObjective: boolean;

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private location: Location,
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
        this.okrService.getKeyResults(okr._id)
          .subscribe(krs => {
            this.keyResults = krs;
            console.log(krs);
            this.krCount = this.okr.keyResults.length;
          });
        if(this.okr.parent){
          this.okrService.getOkr(this.okr.parent)
            .subscribe(parent => this.parent = parent);
        }
        if(this.okr.userId){
          this.userService.getUser(this.okr.userId)
            .subscribe(owner => this.owner = owner);
        }
      });
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
      this.okrService.updateOkr(this.okr, this.keyResults)
        .subscribe((okr: Okr) => {
          console.log(`Saving okr with owner id=${this.okr.userId}`);
          if(okr.parent){
            this.addToParent(okr.parent, okr._id);
            console.log(`adding child with id ${okr._id} to parent w id ${this.okr.parent}`);
          }else{
            this.router.navigateByUrl('/company/okrs')
          }
        });
    }
  }

  addToParent(parentId: string, childId: string): void{
    this.okrService.addChild(parentId, childId)
      .subscribe(()=>{
        console.log('Added child to parent');
        this.router.navigateByUrl('/company/okrs');
      });
  }

  assign(owner: UserDetails): void{
    console.log(`The old owner had id=${this.okr.userId}`)
    this.owner = owner;
    this.okr.userId = owner._id;
    console.log(`Assigning owner with id=${this.okr.userId} as owner`);
    this.ownerSearch('');
  }

  link(parent: Okr): void{
    this.okr.parent = parent._id;
    this.parent = parent;
    console.log(`Linking to parent with objective ${parent.objective}`);
    this.parentSearch('');
  }  
}