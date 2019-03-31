import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

import {AuthenticationService} from '../authentication.service';
import {OkrService} from '../okr.service';
import {Okr, KeyResult} from '../okr/okr';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  
  okrs: {Okr};
  newOKR: boolean;

  constructor(
    private auth: AuthenticationService, 
    private location: Location,
    private okrService: OkrService) { }

  ngOnInit() {
    this.getCompanyOkrs();
    this.newOKR = false;
  }

  setNewOKR(){
    this.newOKR = true;
  }

  hideNewOkr(hide: boolean){
    this.newOKR = !hide;
    this.getCompanyOkrs();
  }

  getCompanyOkrs(): void{
    let user = this.auth.getUserDetails();
    if(user.company){
      this.okrService.getCompanyOkrs(user.company)
      .subscribe(okrs => {
        this.okrs = okrs;
      });
    }
  }
}
