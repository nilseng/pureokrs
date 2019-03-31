import { Component, OnInit, Input } from '@angular/core';

import {OkrService} from '../okr.service';
import {AuthenticationService, UserDetails} from '../authentication.service';
import {UserService} from '../user.service';
import {Okr, KeyResult} from '../okr/okr';

@Component({
  selector: 'app-okr',
  templateUrl: './okr.component.html',
  styleUrls: ['./okr.component.css']
})

export class OkrComponent implements OnInit {

  @Input() okr: Okr;

  keyResults: {};
  owner: UserDetails;

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.getKeyResults();
    this.getOwner();
  }

  getKeyResults(): void{
    let user = this.auth.getUserDetails();
    if(user.company==this.okr.company){
      this.okrService.getKeyResults(this.okr._id)
      .subscribe(krs => {
        this.keyResults = krs;
      });
    }
  }

  getOwner(): void{
    console.log('Getting OKR owner')
    let user = this.auth.getUserDetails();
    if(user.company==this.okr.company){
      this.userService.getUser(this.okr.userId)
      .subscribe(owner => {
        this.owner = owner;
      });
    }
  }

}
