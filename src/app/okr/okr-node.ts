import { Okr } from "src/app/okr/okr";

export class OkrNode {
    okr: Okr;
    children: OkrNode[];
    width?: number;
    height?: number;
    offsetX?: number;
    offsetY?: number;

    isChildrenVisible?: boolean

    constructor(okr, children = [], width?, height?, offsetX?, offsetY?) {
        this.okr = okr;
        this.children = children;
        this.width = width;
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}