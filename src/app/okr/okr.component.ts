import { Component, OnInit, Input } from '@angular/core';

import {OkrService} from '../okr.service';
import {AuthenticationService} from '../authentication.service';
import {Okr, KeyResult} from '../okr/okr';

@Component({
  selector: 'app-okr',
  templateUrl: './okr.component.html',
  styleUrls: ['./okr.component.css']
})

export class OkrComponent implements OnInit {

  @Input() okr: Okr;

  keyResults: {};

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService
    ) { }

  ngOnInit() {
    this.getKeyResults();
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

}
