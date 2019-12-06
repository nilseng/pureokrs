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
  newOKR: boolean;
  user: UserDetails;

  parentId: string;
  okrToEdit: Okr;

  constructor(
    private auth: AuthenticationService,
    private okrService: OkrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.okrs = this.route.snapshot.data['okrs'];
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
    this.okrService.getCompanyOkrs()
      .subscribe(okrs => {
        this.okrs = okrs;
      });
  }

  addChild(parentId: string) {
    this.parentId = parentId;
  }

  editOkr(okr: Okr) {
    this.okrToEdit = okr;
  }

  clearParent() {
    this.parentId = undefined;
  }
}
