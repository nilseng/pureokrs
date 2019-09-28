import { Okr } from "src/app/okr/okr";

export class Node {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    okr: Okr;
    children: Node[];
    
    constructor(okr, width, height, offsetX, offsetY, children = []){
        this.okr = okr;
        this.width = width;
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.children = children;
    }
}