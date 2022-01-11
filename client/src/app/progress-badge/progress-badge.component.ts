import { Component, Input } from "@angular/core";
import { faBatteryEmpty, faAdjust, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-progress-badge',
    templateUrl: './progress-badge.component.html'
})
export class ProgressBadgeComponent {
    @Input() progress: number;

    faBatteryEmpty = faBatteryEmpty
    faAdjust = faAdjust
    faCheckCircle = faCheckCircle
}