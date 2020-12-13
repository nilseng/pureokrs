import { Component, OnInit } from '@angular/core';

import { AuthenticationService, UserDetails } from '../authentication.service';
import { UserService } from '../user.service';
import { faTrashAlt, faPlusCircle, faUserNinja, faEnvelope } from '@fortawesome/free-solid-svg-icons';
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

  users: { User };
  userForm: boolean;
  initDeleteUser: UserDetails;

  user$ = this.auth.getUserDetails();

  constructor(private auth: AuthenticationService,
    private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
    this.userForm = false;
  }

  getUsers(): void {
    this.user$.subscribe(u => {
      if (u.company) {
        this.userService.getUsers()
          .subscribe(users => this.users = users);
      }
    });

  }

  showUserForm(): void {
    this.userForm = true;
  }

  hideUserForm(hide: boolean) {
    this.userForm = false;
    this.getUsers();
  }

  initDelete(user: UserDetails): void {
    this.initDeleteUser = user;
  }

  confirmDelete(): void {
    this.userService.deleteUser(this.initDeleteUser)
      .subscribe(() => {
        this.getUsers();
        this.user$.subscribe(u => {
          if (u.email === this.initDeleteUser.email) {
            this.initDeleteUser = null;
            this.auth.logout();
          } else {
            this.initDeleteUser = null;
          }
        })
      });
  }
}
