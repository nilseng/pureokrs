import { Component } from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private titleService: Title, public auth: AuthenticationService){
    
  }
  title = "PureOKRs";
}
