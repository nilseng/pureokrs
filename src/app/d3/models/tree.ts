import { EventEmitter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';

export class Tree{
    public tree: d3.TreeLayout<any>;

    public nodes: Node[] = [];
    public links: Link[] = [];

    constructor(nodes, links, options: { width, height }) {
        this.nodes = nodes;
        this.links = links;
    }
}