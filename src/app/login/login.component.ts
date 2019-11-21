import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;

  loginMessage: string;

  credentials: TokenPayload;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.email = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })

    this.loginMessage = '';
    this.credentials = {
      company: '',
      email: this.email.value,
      password: this.password.value
    }
  }

  login(formValues) {
    if (!formValues.email || !formValues.password) {
      this.loginMessage = 'Email and password is required to log in'
    } else {
      this.credentials.email = formValues.email;
      this.credentials.password = formValues.password;
      this.auth.login(this.credentials).subscribe(() => {
        this.router.navigateByUrl(`/company/okrs`);
      }, (err) => {
        this.loginMessage = 'Wrong username or password'
      });
    }
  }
}
