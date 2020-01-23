import { Component, OnInit } from '@angular/core'
import {faCookie, faUserShield} from '@fortawesome/free-solid-svg-icons'

@Component({
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent {
  faCookie = faCookie
  faUserShield = faUserShield 
}
