import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import {OkrService} from '../okr.service';

@Injectable()
export class Level0OkrResolver implements Resolve<any> {
    constructor(private okrService: OkrService) { }

    resolve(){
        return this.okrService.getCompanyOkrs();
    }
}