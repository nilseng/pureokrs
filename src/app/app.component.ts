import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = "PureOKRs";

  location: Location;

  constructor(
      private router: Router
    ) {

  }

  ngOnInit() {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }

    if(window.navigator.userAgent.indexOf('msie') > 0){
      this.router.navigateByUrl('/thefutureishere')
    }
    console.log(window.navigator.userAgent)
  }

}
