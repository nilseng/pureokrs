import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { HierarchyPointNode, TreeLayout } from 'd3-hierarchy';
import { Okr } from '../okr/okr';
import { OkrService } from '../okr.service';
import { Node } from './node/node';
import { AuthenticationService, UserDetails } from '../authentication.service';
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTreeSize();
    this.initOkrTree();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    this.setTreeSize();
    this.initOkrTree();
  }

  user: UserDetails;

  okrs: Okr[];
  rootNode: Node;

  _width: any;
  _height: number;
  _nodeWidth: number;
  _nodeHeight: number;
  root: HierarchyPointNode<Node>;
  tree: TreeLayout<Node>;
  svg: any;
  diagonal: any;

  constructor(
    private okrService: OkrService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setTreeSize();
    this.getUserDetails();
    this.okrs = this.route.snapshot.data['okrs'];
    this.initOkrTree();
  }

  setTreeSize() {
    // Adjusting for padding in main element in case of wide screen, otherwise 100% width
    this._width = window.innerWidth > 768 ? window.innerWidth - 160 : window.innerWidth;
    this._height = window.innerHeight * 0.6;
    this._nodeWidth = Math.max(this._width / 6, 100);
    this._nodeHeight = this._nodeWidth / 2.5;
  }

  getUserDetails() {
    this.user = this.authService.getUserDetails();
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

  private draw(root: Node) {
    this.root = undefined;
    this.tree = d3.tree<Node>();
    this.tree.size([this._width, this._height]);
    this.tree.nodeSize([this._nodeWidth, this._nodeHeight * 1.5]);
    this.tree.separation(
      function separation(a, b) {
        return a.parent == b.parent ? 1.2 : 1.4;
      }
    );
    this.root = this.tree(d3.hierarchy<Node>(this.rootNode));
  }

  initOkrTree() {
    if (this.root) this.root = undefined;
    this.rootNode = new Node(
      new Okr(this.user.company + "'s Objectives & Key Results"),
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
    let node: Node;
    for (let okr of level0) {
      node = new Node(
        okr,
        this._nodeWidth,
        this._nodeHeight,
        this._width / 2 - this._nodeWidth / 2,
        this._nodeHeight / 2
      );
      this.rootNode.children.push(node);
    }
    this.draw(this.rootNode);
  }

  pushChildren(node: HierarchyPointNode<Node>) {
    let children = this.okrs.filter(okr => okr.parent === node.data.okr._id);
    let childNode: Node;
    for (let child of children) {
      childNode = new Node(
        child,
        this._nodeWidth,
        this._nodeHeight,
        this._width / 2 - this._nodeWidth / 2,
        this._nodeHeight / 2
      );
      node.data.children.push(childNode);
    }
    this.draw(this.rootNode);
  }

  hideChildren(node: HierarchyPointNode<Node>) {
    node.data.children = [];
    this.draw(this.rootNode);
  }

  savedOkr(okr: Okr) {
    this.okrs.push(okr)
    if (!!okr.parent) {
      let parent = this.okrs.find(parent => parent._id === okr.parent)
      parent.children.push(okr._id)
      let parentNode = this.root.descendants().find(node => node.data.okr._id === okr.parent)
      if (parentNode.children && parentNode.children.length > 0) {
        parentNode.data.children = []
        this.pushChildren(parentNode)
      }
    } else {
      let childNode = new Node(
        okr,
        this._nodeWidth,
        this._nodeHeight,
        this._width / 2 - this._nodeWidth / 2,
        this._nodeHeight / 2
      );
      this.rootNode.children.push(childNode);
      this.draw(this.rootNode);
    }
  }

}