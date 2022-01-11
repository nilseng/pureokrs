import { Component } from "@angular/core"
import {faQuestionCircle, faBlog, faEnvelope, faShieldAlt} from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {
    faQuestionCircle = faQuestionCircle
    faBlog = faBlog
    faEnvelope = faEnvelope
    faShieldAlt = faShieldAlt
}