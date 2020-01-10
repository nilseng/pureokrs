import { Component, OnInit, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { HierarchyPointNode, TreeLayout, HierarchyPointLink } from 'd3-hierarchy';
import { Okr } from '../okr/okr';
import { OkrService } from '../okr.service';
import { Node } from './node/node';
import { Edge } from './edge/edge';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-okr-tree',
  templateUrl: './okr-tree.component.html',
  styleUrls: ['./okr-tree.component.css']
})
export class OkrTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('svg') svgEl: ElementRef;
  @ViewChild('container') containerEl: ElementRef;
  @ViewChild('modal') modal: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._width = window.innerWidth * 0.9;
    this._height = window.innerHeight * 0.6;
    this._nodeWidth = Math.max(this._width / 6, 100);
    this._nodeHeight = this._nodeWidth / 2.5;
    this.draw(this.rootNode);
  }

  user: UserDetails;

  okrs: Okr[];
  rootNode: Node;
  edges: HierarchyPointLink<Node>[];
  nodes: HierarchyPointNode<Node>[];

  _width: number;
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
  ) {
  }

  ngOnInit() {
    this._width = window.innerWidth * 0.9;
    this._height = window.innerHeight * 0.6;
    this._nodeWidth = Math.max(this._width / 6, 100);
    this._nodeHeight = this._nodeWidth / 2.5;
    this.getUserDetails();
    this.okrs = this.route.snapshot.data['okrs'];
    this.initOkrTree();
  }

  ngAfterViewInit() {
    
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
    this.edges = [];
    this.nodes = [];
    this.root = undefined;

    let width = this._width;
    let height = this._height;
    let nodeWidth = this._nodeWidth;
    let nodeHeight = this._nodeHeight;

    this.tree = d3.tree<Node>();
    this.tree.size([width, height]);
    this.tree.nodeSize([nodeWidth, nodeHeight * 1.5]);
    this.tree.separation(
      function separation(a, b) {
        return a.parent == b.parent ? 1.2 : 1.4;
      }
    );
    this.root = this.tree(d3.hierarchy<Node>(this.rootNode));
    this.nodes = this.root.descendants();
    this.edges = this.root.links()
  }

  initOkrTree() {
    this.rootNode = new Node(
      new Okr(this.user.company + "'s Objectives & Key Results"),
      this._nodeWidth,
      this._nodeHeight,
      this._width / 2 - this._nodeWidth / 2,
      this._nodeHeight / 2
    );
    let level0 = [];
    level0 = this.okrs.filter(okr => !okr.parent || okr.parent === null || okr.parent == '');
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
    if(!!okr.parent){
      let parent = this.okrs.find(parent => parent._id === okr.parent)
      parent.children.push(okr._id)
      let parentNode = this.nodes.find(node => node.data.okr._id === okr.parent)
      if(parentNode.children && parentNode.children.length > 0){
        parentNode.data.children = []
        this.pushChildren(parentNode)
      }
    }else{
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