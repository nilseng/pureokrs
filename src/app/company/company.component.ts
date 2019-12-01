import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService, UserDetails } from '../authentication.service';
import { OkrService } from '../okr.service';
import { Okr } from '../okr/okr';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  okrs: Okr[];
  visibleOkrs: Okr[] = [];
  newOKR: boolean;
  user: UserDetails;

  parentId: string;

  constructor(
    private auth: AuthenticationService,
    private okrService: OkrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.okrs = this.route.snapshot.data['okrs'];
    if (this.okrs) {
      this.getCompanyOkrs();
    }
    this.newOKR = false;
    this.getUserDetails();
    this.parentId = '';
  }

  getUserDetails(): void {
    this.user = this.auth.getUserDetails();
  }

  hideOkr(okrId: string) {
    this.getOkrs();
  }

  savedOkr(okr: Okr) {
    this.getOkrs();
  }

  getOkrs() {
    this.okrService.getOkrs()
      .subscribe(okrs => {
        this.okrs = okrs;
        this.getCompanyOkrs();
      });
  }

  getCompanyOkrs(): void {
    this.visibleOkrs = this.okrs.filter(okr => {
      return (okr.parent === '' || !okr.parent || okr.parent === null);
    });
  }

  addChild(parentId: string) {
    this.parentId = parentId;
  }

  clearParent() {
    this.parentId = undefined;
  }
}
