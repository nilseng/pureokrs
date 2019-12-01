import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = "PureOKRs";

  location: Location;

  constructor(private titleService: Title){
    
  }

  ngOnInit(){
    if (environment.production) {
      if (location.protocol === 'http:') {
       window.location.href = location.href.replace('http', 'https');
      }
     }
  }
  
}
