import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginMessage: string;

  credentials: TokenPayload;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.loginMessage = '';
    this.credentials = {
      company: '',
      email: '',
      password: ''
    }
  }

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.loginMessage = 'Email and password is required to log in'
    } else {
      this.auth.login(this.credentials).subscribe(() => {
        this.router.navigateByUrl(`/company`);
      }, (err) => {
        this.loginMessage = 'Wrong username or password'
      });
    }
  }
}
