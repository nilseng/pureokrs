import { Component, OnInit, Input } from '@angular/core';
import { HierarchyPointLink } from 'd3';
import { OkrNode } from '../../okr/okr-node';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.css']
})
export class EdgeComponent implements OnInit {

  @Input() edge: HierarchyPointLink<OkrNode>;

  constructor() { }

  ngOnInit() {
  }

}
