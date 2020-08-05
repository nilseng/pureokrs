import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { HierarchyPointNode, TreeLayout } from 'd3-hierarchy';
import { Okr } from '../okr/okr';
import { OkrService } from '../okr.service';
import { OkrNode } from '../okr/okr-node';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-okr-tree',
  templateUrl: './okr-tree.component.html',
  styleUrls: ['./okr-tree.component.css']
})
export class OkrTreeComponent implements OnInit {
  @ViewChild('svg', { static: true }) svgEl: ElementRef;
  @ViewChild('container', { static: true }) containerEl: ElementRef;
  @ViewChild('modal', { static: true }) modal: ElementRef;

  /* @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTreeSize();
    this.initOkrTree();
  } */

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    this.setTreeSize();
    this.initOkrTree();
  }

  user$ = this.authService.getUserDetails();

  okrs: Okr[];
  rootNode: OkrNode;

  _width: any;
  _height: number;
  _nodeWidth: number;
  _nodeHeight: number;

  // Used to move all nodes vertically
  offsetY: number;

  root: HierarchyPointNode<OkrNode>;
  tree: TreeLayout<OkrNode>;
  svg: any;
  diagonal: any;

  okrNodeToEdit: OkrNode


  constructor(
    private okrService: OkrService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setTreeSize();
    this.okrs = this.route.snapshot.data['okrs'];
    this.initOkrTree();
  }

  setTreeSize() {
    // Adjusting for padding in main element in case of wide screen, otherwise 100% width
    this._width = window.innerWidth > 768 ? window.innerWidth - 160 : window.innerWidth;
    this._height = window.innerHeight * 0.6;
    this._nodeWidth = Math.max(this._width / 6, 100);
    this._nodeHeight = this._nodeWidth / 2.5;
    this.offsetY = - this._nodeHeight;
  }

  //Getting the list of OKRs and transforming it to a tree structure
  getOkrs() {
    this.okrs = [];
    this.okrService.getOkrs()
      .subscribe(okrs => {
        this.okrs = okrs;
        this.initOkrTree();
      });
  }

  private draw(root: OkrNode) {
    this.root = undefined;
    this.tree = d3.tree<OkrNode>();
    this.tree.size([this._width, this._height]);
    this.tree.nodeSize([this._nodeWidth, this._nodeHeight * 1.5]);
    this.tree.separation(
      function separation(a, b) {
        return a.parent == b.parent ? 1.2 : 1.4;
      }
    );
    this.root = this.tree(d3.hierarchy<OkrNode>(this.rootNode));
  }

  initOkrTree() {
    if (this.root) this.root = undefined;
    this.rootNode = new OkrNode(
      new Okr(""),
      [],
      this._nodeWidth,
      this._nodeHeight,
      this._width / 2 - this._nodeWidth / 2,
      this._nodeHeight / 2
    );
    let level0 = [];
    let okrIds = this.okrs.map(okr => okr._id)
    level0 = this.okrs.filter(okr =>
      !okr.parent || okr.parent === null || okr.parent === '' || !okrIds.includes(okr.parent)
    );
    let node: OkrNode;
    for (let okr of level0) {
      node = new OkrNode(
        okr,
        [],
        this._nodeWidth,
        this._nodeHeight,
        this._width / 2 - this._nodeWidth / 2,
        this.offsetY
      );
      this.rootNode.children.push(node);
    }
    this.draw(this.rootNode);
  }

  pushChildren(node: HierarchyPointNode<OkrNode>) {
    let children = this.okrs.filter(okr => okr.parent === node.data.okr._id);
    let childNode: OkrNode;
    for (let child of children) {
      childNode = new OkrNode(
        child,
        [],
        this._nodeWidth,
        this._nodeHeight,
        this._width / 2 - this._nodeWidth / 2,
        this.offsetY
      );
      node.data.children.push(childNode);
    }
    this.draw(this.rootNode);
  }

  hideChildren(node: HierarchyPointNode<OkrNode>) {
    node.data.children = [];
    this.draw(this.rootNode);
  }

  savedOkr(okr: Okr) {
    if (!!okr.parent) {
      let parent = this.okrs.find(parent => parent._id === okr.parent)
      parent.children.push(okr._id)
      let parentNode = this.root.descendants().find(node => node.data.okr._id === okr.parent)
      if (parentNode.children && parentNode.children.length > 0) {
        parentNode.data.children = []
        this.pushChildren(parentNode)
      }
    } else {
      if (this.root.children.map(child => child.data.okr._id).indexOf(okr._id) === -1) {
        let childNode = new OkrNode(
          okr,
          [],
          this._nodeWidth,
          this._nodeHeight,
          this._width / 2 - this._nodeWidth / 2,
          this.offsetY
        );
        this.rootNode.children.push(childNode);
        this.draw(this.rootNode);
      }
    }
  }

  editOkrNode(okrNode: OkrNode) {
    this.okrNodeToEdit = okrNode
  }
}