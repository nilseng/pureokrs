import { Okr } from "src/app/okr/okr";

export class Node {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    okr: Okr;
    siblings: number;
    level: number;
    showChildren: boolean;
    
    constructor(okr, x, y, width, height, siblings, level, showChildren = false){
        this.okr = okr;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.centerX = x - this.width / 2;
        this.centerY = y - this.height / 2;
        this.siblings = siblings;
        this.level = level;
        this.showChildren = showChildren;
    }

    get cx(){
        return this.x;
    }

    get cy(){
        return this.y + this.height/2;
    }

    get children(){
        return this.okr.children.length;
    }
}