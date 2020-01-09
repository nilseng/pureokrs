import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../authentication.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  email: string;  
  
  loginMessage: string;

  constructor(
    private auth: AuthenticationService, private router: Router
  ) { }

  ngOnInit() {
    this.loginMessage = '';
  }

  reset() {
    if (!this.email) {
      this.loginMessage = 'Provide your email to reset your password';
    } else {
      this.auth.sendResetEmail(this.email).subscribe(() => {
        this.loginMessage = 'See your email to reset your password.';
      }, (err) => {
        this.loginMessage = 'Could not find a user with this email or could not reset the password.';
      });
    }
  }

}
