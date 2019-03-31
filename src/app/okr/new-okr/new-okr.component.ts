import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {Okr, KeyResult} from '../okr';
import {OkrService} from '../../okr.service';

@Component({
  selector: 'app-new-okr',
  templateUrl: './new-okr.component.html',
  styleUrls: ['./new-okr.component.css']
})
export class NewOkrComponent implements OnInit {

  @Output() hide = new EventEmitter<boolean>();

  okr: Okr;
  objective: string;
  keyResults: KeyResult[];

  constructor(
    private okrService: OkrService,
    private router: Router,
    private location: Location
    ) { }

  ngOnInit() {
    this.objective = '';
    let krCount = 1;
    this.keyResults = [];
    for(let i=0; i<krCount; i++){
      this.keyResults.push(new KeyResult(''));
    }
    this.okr = new Okr(this.objective, this.keyResults)
  }

  addKeyResult(): void {
    this.okr.keyResults.push(new KeyResult(''));
  }

  removeKeyResult(): void {
    this.okr.keyResults.pop();
  }

  hideNew(): void {
    this.hide.emit(true);
  }

  save(): void {
    if(!this.okr.objective.trim()){
      return;
    }else{
      if(this.okr.parent){
        //TODO: Add OKR to parent by id
        //this.okr.parent.children.push(this.okr._id);
      }
      this.okrService.createOkr(this.okr)
      .subscribe(() => this.hideNew());
    }
  }
}
