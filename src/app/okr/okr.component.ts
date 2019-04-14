import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { OkrService } from '../okr.service';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { UserService } from '../user.service';
import { Okr, KeyResult } from '../okr/okr';

@Component({
  selector: 'app-okr',
  templateUrl: './okr.component.html',
  styleUrls: ['./okr.component.css']
})

export class OkrComponent implements OnInit {

  @Input() okr: Okr;
  @Output() hideOkrId = new EventEmitter<string>();

  keyResults: {};
  owner: UserDetails;
  parent: Okr;
  children: {};
  showChildren: boolean;
  childrenCount: number;

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getKeyResults();
    this.getOwner();
    this.getParent();
    this.children = [];
    this.showChildren = false;
    this.childrenCount = this.okr.children.length;
  }

  getChildren(): void {
    this.okrService.getChildren(this.okr._id)
      .subscribe(children => {
        this.children = children;
        this.showChildren = true;
      });
  }

  hideChildren(): void {
    this.children = {};
    this.showChildren = false;
  }

  getKeyResults(): void {
    let user = this.auth.getUserDetails();
    if (user.company == this.okr.company) {
      this.okrService.getKeyResults(this.okr._id)
        .subscribe(krs => {
          this.keyResults = krs;
        });
    }
  }

  getOwner(): void {
    if (this.okr.userId) {
      this.userService.getUser(this.okr.userId)
        .subscribe(owner => {
          this.owner = owner;
        });
    }
  }

  getParent(): void {
    if (this.okr.parent) {
      this.okrService.getOkr(this.okr.parent)
        .subscribe(parent => this.parent = parent);
    }
  }

  deleteOKR(): void {
    this.okrService.deleteOkr(this.okr)
      .subscribe(() => this.hideOkrId.emit(this.okr._id));
  }

  hideChild(okrId: string){
    this.getChildren();
    this.childrenCount = this.childrenCount - 1;
  }
}