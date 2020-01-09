import { Component, OnInit } from '@angular/core';

import {AuthenticationService, UserDetails} from '../authentication.service';
import {UserService} from '../user.service';
import {faTrashAlt, faPlusCircle, faUserNinja, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  faTrashAlt = faTrashAlt;
  faPlusCircle = faPlusCircle;
  faUserNinja = faUserNinja;
  faEnvelope = faEnvelope;

  users: {User};
  user: UserDetails;
  userForm: boolean;
  initDeleteUser: UserDetails;

  constructor(private auth: AuthenticationService,
    private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
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

  initDelete(user: UserDetails): void{
    this.initDeleteUser = user;
  }

  confirmDelete(): void{
    this.userService.deleteUser(this.initDeleteUser)
      .subscribe(() => {
        this.getUsers();
        if(this.auth.getUserDetails().email === this.initDeleteUser.email){
          this.initDeleteUser = null;
          this.auth.logout();
        }else{
          this.initDeleteUser = null;
        }
      });
  }
}
