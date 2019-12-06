import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication.service';

@Injectable()
export class UsersResolver implements Resolve<any>{

    constructor(private auth: AuthenticationService, private userService: UserService){

    }

    resolve(){
        let user = this.auth.getUserDetails();
        return this.userService.getUsers(decodeURIComponent(user.company));
    }
}