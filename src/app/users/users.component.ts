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

  constructor(private auth: AuthenticationService,
    private userService: UserService) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers(): void{
    let user = this.auth.getUserDetails();
    if(user.company){
      this.userService.getUsers(decodeURIComponent(user.company))
        .subscribe(users => this.users = users);
    }
  }

}
