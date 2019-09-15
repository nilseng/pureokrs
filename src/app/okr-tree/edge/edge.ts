import {Node} from '../node/node';

export class Edge{
    source: Node;
    target: Node;
    x1: number;
    y1: number;
    x2: number;
    y2: number; 

    constructor(source, target){
        this.source = source;
        this.target = target;
        this.x1 = source.x;
        this.y1 = source.y;
        this.x2 = target.x;
        this.y2 = target.y;
    }
}