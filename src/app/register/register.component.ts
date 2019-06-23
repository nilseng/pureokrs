import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  message: string;
  credentials: TokenPayload;

  ngOnInit(){
    this.credentials = {
      company: '',
      email: '',
      name: '',
      password: ''
    };
    this.message = '';
  }

  

  constructor(private auth: AuthenticationService, private router: Router) { }

  register() {
    if(!this.credentials.email || !this.credentials.name || !this.credentials.password){
      this.message = 'Complete all fields to register.';
    }else if(this.credentials.password.length < 6){
      this.message = 'The password must contain at least 6 characters';
    }else{
      this.auth.register(this.credentials).subscribe(()=>{
        this.router.navigateByUrl(`/company/okrs`);
      }, (err) => {
        this.message = "Could not register. Log in instead if you're already registered.";
      });
    }
  }
}
