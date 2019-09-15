import { Component, OnInit, HostListener } from '@angular/core';
import { Node } from '../node/node';
import { Edge } from '../edge/edge';
import { OkrService } from '../../okr.service';
import { Okr } from 'src/app/okr/okr';

@Component({
  selector: 'app-tree-visual',
  templateUrl: './tree-visual.component.html',
  styleUrls: ['./tree-visual.component.css']
})
export class TreeVisualComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._options = {
      width: window.innerWidth - window.innerWidth / 20,
      height: window.innerHeight - window.innerHeight * 0.4
    };
    this.createLevel0();
  }

  _options: { width, height } = { width: 800, height: 600 };

  okrs: Okr[];
  nodes: Node[][] = [];
  edges: Edge[] = [];

  xUnit: number;
  nodeWidth: number;

  constructor(private okrService: OkrService) { }

  ngOnInit() {
    this._options = {
      width: window.innerWidth - window.innerWidth / 20,
      height: window.innerHeight - window.innerHeight * 0.4
    };

    this.getOkrs();
  }

  createLevel0() {
    this.nodes = [];
    this.edges = [];
    //filtering OKRs at level 0
    let level0 = this.okrs.filter(
      okr => !("parent" in okr) || !okr.parent
    );

    this.nodeWidth = Math.min(
      this._options.width / level0.length - this._options.width / 20,
      200
    );

    this.xUnit = this.nodeWidth + this.nodeWidth / 4;

    let center = this._options.width / 2;
    if (level0.length % 2 === 0) {
      center -= this.xUnit / 2;
    }

    let offset = 0;
    this.nodes.push([]);

    for (let okr in level0) {
      offset = this.xUnit * (+okr % 2) * (+okr + 1) / 2 - this.xUnit * ((+okr - 1) % 2) * +okr / 2;
      this.nodes[0].push(
        new Node(
          level0[okr],
          center + offset,
          this.nodes.length * 2 * this._options.height / 10,
          this.nodeWidth,
          this._options.height * 0.12,
          level0.length,
          0
        )
      );
    }
  }

  get options() {
    return this._options = {
      width: window.innerWidth - window.innerWidth / 20,
      height: window.innerHeight - window.innerHeight * 0.4
    };
  }

  getOkrs() {
    this.okrService.getOkrs()
      .subscribe(okrs => {
        this.okrs = okrs;
        this.createLevel0();
      });
  }

  showChildren(node: Node) {
    let children = [];
    let center = node.x;
    if (node.okr.children.length % 2 === 0) {
      center -= this.xUnit / 2;
    }
    let offset = 0;
    if(this.nodes[node.level + 1] === undefined){
      this.nodes[node.level + 1] = [];
    }
    let child;
    children = this.okrs
      .filter(okr => okr.parent === node.okr._id);
    for (let okr in children) {
      offset = this.xUnit * (+okr % 2) * (+okr + 1) / 2 - this.xUnit * ((+okr - 1) % 2) * +okr / 2;
      child = new Node(
        children[okr],
        center + offset,
        (node.level + 2) * 2 * this._options.height / 10,
        this.nodeWidth,
        this._options.height * 0.12,
        children.length,
        node.level+1
      );
      this.nodes[node.level + 1].push(child);
      this.edges.push(new Edge(node, child));
    }
  }

  hideChildren(node: Node){
    if(this.nodes[node.level + 1] === undefined){
      return;
    }else{
      for(let child of this.nodes[node.level + 1]){
        if(node.okr.children.includes(child.okr._id) && child.showChildren){
          this.hideChildren(child);
        }
      }
      this.nodes[node.level + 1] = this.nodes[node.level + 1]
        .filter(child => !node.okr.children.includes(child.okr._id));
      this.edges = this.edges
        .filter(edge => edge.source !== node)
    }
  }
}