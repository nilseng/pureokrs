import { Component, OnInit, Input } from '@angular/core';
import { Edge } from './edge';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.css']
})
export class EdgeComponent implements OnInit {

  @Input() edge: Edge;

  constructor() { }

  ngOnInit() {
  }

}
