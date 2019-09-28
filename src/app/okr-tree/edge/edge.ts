import {Node} from '../node/node';
import {HierarchyPointNode} from 'd3-hierarchy';

export class Edge{
    source: HierarchyPointNode<Node>;
    target: HierarchyPointNode<Node>;
    x1: number;
    y1: number;
    x2: number;
    y2: number; 

    constructor(source: HierarchyPointNode<Node>, target: HierarchyPointNode<Node>){
        this.source = source;
        this.target = target;
        this.x1 = source.x + source.data.width/2;
        this.y1 = source.y + source.data.height/2;
        this.x2 = target.x + target.data.width/2;
        this.y2 = target.y + target.data.height/2;
    }
}