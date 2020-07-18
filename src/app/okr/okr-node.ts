import { Okr } from "src/app/okr/okr";

export class OkrNode {
    width?: number;
    height?: number;
    offsetX?: number;
    offsetY?: number;
    okr: Okr;
    children: OkrNode[];
    isChildrenVisible?: boolean

    constructor(okr, children = [], width?, height?, offsetX?, offsetY?) {
        this.okr = okr;
        this.width = width;
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.children = children;
    }
}