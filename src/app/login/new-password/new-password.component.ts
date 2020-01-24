import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  password: string;
  email: string;
  token: string;
  pwdReset: boolean;
  message: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.password = '';
    this.getEmail();
    this.getToken();
    this.pwdReset = false;
    this.message = '';
  }

  getEmail() {
    this.email = this.route.snapshot.paramMap.get('email');
  }

  getToken() {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  newPassword() {
    if (this.password.length < 6) {
      this.message = 'The password must contain at least 6 characters.'
    } else {
      this.auth.newPassword(this.email, this.token, this.password)
        .subscribe(() => {
          this.router.navigateByUrl('');
        }, (err) => {
          this.message = 'Something went wrong. Please get in touch at contact@pureokrs.com'
        });
    }
  }
}
