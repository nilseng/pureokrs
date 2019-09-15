import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.css']
})
export class EdgeComponent implements OnInit {

  @Input() edge: number;

  constructor() { }

  ngOnInit() {
  }

}
