import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import {OkrService} from '../okr.service';

@Injectable()
export class OkrResolver implements Resolve<any> {
    constructor(private okrService: OkrService) { }

    resolve(){
        return this.okrService.getOkrs();
    }
}