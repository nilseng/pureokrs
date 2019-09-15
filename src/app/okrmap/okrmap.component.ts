import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { UserDetails, AuthenticationService } from '../authentication.service';
import { OkrService } from '../okr.service';
import { D3Service } from '../d3/d3.service';
import { Node } from '../d3/models/node';
import { Link } from '../d3/models/link';

@Component({
  selector: 'app-okrmap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './okrmap.component.html',
  styleUrls: ['./okrmap.component.css']
})
export class OkrmapComponent implements OnInit {
  nodes: Node[] = [];
  links: Link[] = [];

  okrs: { Okr };
  user: UserDetails;
  newOKR: boolean;

  screenHeight: number;
  screenWidth: number;

  constructor(
    private auth: AuthenticationService,
    private okrService: OkrService
  ) { }

  ngOnInit() {
    this.getOkrs();
    this.getUserDetails();
    this.newOKR = false;

    let N = 0;
    const L = 4;
    for (let i = 1; i <= L; i++) {
      N += Math.pow(L, i-1);
      if(i===L){
        this.createNodesAndLinks(N, L);
      }
    }
  }

  createTree(){
    for(let okr in this.okrs){
      this.nodes.push(new Node(okr));
    }
    for(let okr in this.okrs){
      if(+okr!=0){
        this.links.push(new Link(+okr-1, +okr));
        this.nodes[+okr-1].linkCount++;
        this.nodes[+okr].linkCount++;
      }
    }
  }

  createNodesAndLinks(N: number, L: number) {

    /** constructing the nodes array */
    
    for (let i = 0; i < N; i++) {
      this.nodes.push(new Node(i));
    }
    console.log('Number of nodes: ', N);
    let p = 0;
    let P = 0;
    for (let i = 1; i < L; i++) {
      p = Math.pow(L, i - 1);
      for (let j = 1; j <= p; j++) {
        for (let k = 1; k <= L; k++) {
          this.nodes[P + j - 1].linkCount++;
          this.nodes[P + p + (j - 1) * L + k - 1].linkCount++;
          this.links.push(new Link(P + j - 1, P + p + (j - 1) * L + k - 1));
          console.log('adding link from', P + j - 1, 'to', P + p + (j - 1) *L + k - 1);
        }
      }
      P += p;
    }
  }

  getUserDetails(): void {
    this.user = this.auth.getUserDetails();
  }

  setNewOKR() {
    this.newOKR = true;
  }

  getOkrs(): void {
    let user = this.auth.getUserDetails();
    if (user.company) {
      this.okrService.getCompanyOkrs(decodeURIComponent(user.company))
        .subscribe(okrs => {
          this.okrs = okrs;
          //this.createTree();
        });
    }
  }

  hideNewOkr(hide: boolean) {
    this.newOKR = false;
    this.getOkrs();
  }

}
