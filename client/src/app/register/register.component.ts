import { Component } from '@angular/core'
import { AuthenticationService, TokenPayload } from '../authentication.service'
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  message: string
  pwdMessage: string

  registerForm: FormGroup
  company: FormControl
  name: FormControl
  email: FormControl
  password: FormControl
  terms: FormControl

  ngOnInit() {
    this.message = ''
    this.pwdMessage = ''

    this.company = new FormControl('', Validators.required)
    this.name = new FormControl('', Validators.required)
    this.email = new FormControl('', [Validators.required, Validators.email])
    this.password = new FormControl('', Validators.required)
    this.terms = new FormControl('', Validators.required)

    this.registerForm = new FormGroup({
      company: this.company,
      name: this.name,
      email: this.email,
      password: this.password,
      terms: this.terms
    })
  }

  constructor(private auth: AuthenticationService, private router: Router) { }

  register() {
    if (!this.registerForm.valid) {
      this.message = 'The input is not valid'
    } else {
      this.auth.register(this.registerForm.value).subscribe(() => {
        this.router.navigateByUrl('')
      }, (err) => {
        this.message = "Could not register. Log in instead if you're already registered."
      })
    }
  }
}
