import { Component, OnInit } from '@angular/core';

import {AuthenticationService, UserDetails} from '../authentication.service';
import {UserService} from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: {User};
  user: UserDetails;
  userForm: boolean;

  constructor(private auth: AuthenticationService,
    private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
    this.getUserDetails();
    this.userForm = false;
  }

  getUsers(): void{
    let user = this.auth.getUserDetails();
    if(user.company){
      this.userService.getUsers(decodeURIComponent(user.company))
        .subscribe(users => this.users = users);
    }
  }

  getUserDetails(): void{
    this.user = this.auth.getUserDetails();
  }

  showUserForm(): void{
    this.userForm = true;
  }

  hideUserForm(hide: boolean){
    this.userForm = false;
    this.getUsers();
  }
}
