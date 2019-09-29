import { Component, OnInit } from '@angular/core';

import { AuthenticationService, UserDetails } from '../authentication.service';
import { OkrService } from '../okr.service';
import { Okr } from '../okr/okr';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  okrs: { Okr };
  newOKR: boolean;
  user: UserDetails;

  parentId: string;

  constructor(
    private auth: AuthenticationService,
    private okrService: OkrService) { }

  ngOnInit() {
    this.getCompanyOkrs();
    this.newOKR = false;
    this.getUserDetails();
    this.parentId = '';
  }

  getUserDetails(): void {
    this.user = this.auth.getUserDetails();
  }

  hideOkr(okrId: string) {
    this.getCompanyOkrs();
  }

  savedOkr(okr: Okr) {
    console.log('okr saved');
    if (okr.parent && okr.parent.trim()) {

    } else {
      this.getCompanyOkrs();
    }
  }

  getCompanyOkrs(): void {
    let user = this.auth.getUserDetails();
    if (user.company) {
      this.okrService.getCompanyOkrs(decodeURIComponent(user.company))
        .subscribe(okrs => {
          this.okrs = okrs;
        });
    }
  }

  addChild(parentId: string) {
    this.parentId = parentId;
  }
}
