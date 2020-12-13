import { Component } from "@angular/core";
import { faSitemap, faUsers, faUserNinja, faStream, faChartPie } from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
})

export class WelcomeComponent {

    faStream = faStream
    faSitemap = faSitemap
    faUsers = faUsers
    faUserNinja = faUserNinja
    faChartPie = faChartPie

}