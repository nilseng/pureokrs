import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
import { OkrNode } from '../../okr/okr-node';
import { HierarchyPointNode } from 'd3';

@Component({
  selector: '[okrTreeNode]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {

  @Input() okrTreeNode: HierarchyPointNode<OkrNode>;
  @Output() okrNodeToEdit = new EventEmitter<HierarchyPointNode<OkrNode>>();

  keyResults: {};
  progress: number;

  ngOnInit() {
    this.getProgress();
  }

  editOkr() {
    this.okrNodeToEdit.emit(this.okrTreeNode);
  }

  getProgress(): void {
    if (this.okrTreeNode.data.okr._id) {
      let sum = 0;
      let count = 0;
      this.okrTreeNode.data.okr.keyResults
        .forEach(kr => {
          if (kr.progress) {
            sum += kr.progress;
          }
          count += 1;
        });
      this.progress = count ? (sum / count) / 100 : 0;
    }
  }
}
