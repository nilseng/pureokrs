import {Okr} from '../../okr/okr'

export class OkrNode {
    okr: Okr
    children: OkrNode[]
    isChildrenVisible: boolean
    
    constructor(okr, children = [], isChildrenVisible = false){
        this.okr = okr
        this.children = children
        this.isChildrenVisible = isChildrenVisible
    }
}