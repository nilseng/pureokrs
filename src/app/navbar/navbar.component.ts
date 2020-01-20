import { Component } from "@angular/core"
import {faSitemap, faUsers, faUserNinja, faStream} from '@fortawesome/free-solid-svg-icons'
import { AuthenticationService } from "../authentication.service"

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    faStream = faStream
    faSitemap = faSitemap
    faUsers = faUsers
    faUserNinja = faUserNinja

    constructor(public auth: AuthenticationService){
        
    }
}