import { Component } from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Title} from '@angular/platform-browser';
import {faSitemap, faUsers, faUserNinja, faQuestionCircle, faBlog, faEnvelope} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faSitemap = faSitemap;
  faUsers = faUsers;
  faUserNinja = faUserNinja;
  faQuestionCircle = faQuestionCircle;
  faBlog = faBlog;
  faEnvelope = faEnvelope;

  constructor(private titleService: Title, public auth: AuthenticationService){
    
  }
  title = "PureOKRs";
}
