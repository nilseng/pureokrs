import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserService } from '../user.service';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Injectable()
export class UsersResolver implements Resolve<any>{

    constructor(private auth: AuthenticationService, private userService: UserService) {

    }

    resolve() {
        let user: UserDetails;
        this.auth.getUserDetails().subscribe(
            u => user = u
        )
        return this.userService.getUsers(decodeURIComponent(user.company));
    }
}