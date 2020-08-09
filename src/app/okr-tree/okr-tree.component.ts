import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { OkrService } from '../okr.service';
import { OkrNode } from '../okr/okr-node';
import { AuthenticationService } from '../authentication.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ITreeConfig {
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
  offsetX: number;
  offsetY: number;
}

@Component({
  selector: 'app-okr-tree',
  templateUrl: './okr-tree.component.html',
  styleUrls: ['./okr-tree.component.css']
})
export class OkrTreeComponent implements OnInit {
  @ViewChild('svg', { static: true }) svgEl: ElementRef;
  @ViewChild('container', { static: true }) containerEl: ElementRef;
  @ViewChild('modal', { static: true }) modal: ElementRef;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    this.getTreeConfig();
  }

  tree$ = this.okrService.okrTreeWithActions$
  okrTreeIsLoading$ = this.okrService.okrTreeIsLoading$
  okrTreeConfig$ = this.okrService.treeConfig$

  vm$ = combineLatest([this.tree$, this.okrTreeConfig$]).pipe(
    map(([tree, config]) => ({ tree, config }))
  )

  user$ = this.authService.getUserDetails();

  svg: any;
  diagonal: any;

  okrNodeToEdit: OkrNode

  constructor(
    private okrService: OkrService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getTreeConfig();
  }

  getTreeConfig() {
    // Adjusting for padding in main element in case of wide screen, otherwise 100% width
    const width = window.innerWidth > 768 ? window.innerWidth - 160 : window.innerWidth
    const treeConfig = {
      width: width,
      height: window.innerHeight * 0.6,
      nodeWidth: Math.max(width / 6, 150),
      nodeHeight: Math.max(width / 15, 60),
      offsetX: width / 2 - Math.max(width / 6, 150) / 2,
      offsetY: - width / 15
    }
    this.okrService.treeConfigSubject.next(treeConfig)
  }

  savedOkr(okrNode: OkrNode) {
    this.okrService.okrSaved(okrNode)
  }

  editOkrNode(okrNode: OkrNode) {
    this.okrNodeToEdit = okrNode
  }
}