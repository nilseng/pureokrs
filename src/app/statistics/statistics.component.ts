import { Component } from "@angular/core";
import { combineLatest } from 'rxjs';
import { map, tap } from "rxjs/operators";

import { AuthenticationService } from "../authentication.service";
import { OkrService } from "../okr.service";
import { KeyResult } from "../okr/okr";
import { UserService } from "../user.service";

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
    okrs$ = this.okrService.okrs$
    keyResults$ = this.okrService.keyResults$
    user$ = this.auth.getUserDetails()
    users$ = this.userService.getUsers()

    isLoading = true

    constructor(private auth: AuthenticationService, private okrService: OkrService, private userService: UserService) { }

    vm$ = combineLatest([this.okrs$, this.keyResults$, this.user$, this.users$]).pipe(
        map(([okrs, keyResults, user, users]) => ({
            okrs,
            ownOkrs: okrs.filter(okr => okr.userId === user._id),
            keyResults,
            avgKRProgress: () => {
                let sum = 0
                keyResults.forEach(kr => { if (kr?.progress) sum += kr.progress })
                return keyResults?.length > 0 ? (sum / keyResults.length).toFixed() : 0;
            },
            avgOkrProgress: () => {
                let sumOfAvgs = 0;
                okrs.forEach(okr => {
                    let okrSum = 0;
                    okr.keyResults.forEach(kr => { if (kr?.progress) okrSum += kr.progress })
                    if (okrSum && okr.keyResults?.length > 0) sumOfAvgs += okrSum / okr.keyResults.length
                })
                return okrs?.length > 0 ? (sumOfAvgs / okrs.length).toFixed() : 0;
            },
            user,
            users
        })),
        tap(_ => this.isLoading = false)
    )
}

