import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../authentication.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html'
})
export class NewUserComponent implements OnInit {

  //Tell parent component to hide this component when OKR is saved
  @Output() hide = new EventEmitter<boolean>();

  credentials: TokenPayload;

  constructor(
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.credentials = {
      company: this.auth.getUserDetails().company,
      email: '',
      password: '',
      name: ''
    }
  }

  addUser(): void {
    if (this.credentials.name == '' || this.credentials.email == '') {
      console.log('Please complete name and email to add new user.');
    } else {
      this.randomPwd(() => {
        if (this.credentials.password.length >= 16) {
          this.auth.addUser(this.credentials)
            .subscribe(()=>{
              this.hideNew();
            });
        } else {
          console.log('Password not valid.');
        }
      });
    }
  }

  randomPwd(callback): void {
    let result = '';
    const length = 16 + Math.floor(4 * Math.random());
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.credentials.password = result;
    callback();
  }

  hideNew(): void {
    this.hide.emit(true);
  }

}
