import { Injectable } from '@angular/core'
import { OkrService } from './okr.service';
import { hierarchy, HierarchyNode } from 'd3';
import { Observable, of } from 'rxjs';
import { Okr } from './okr/okr';
import { OkrNode } from './okr/okr-node';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OkrTreeService {

    rootNode: OkrNode
    okrs: Okr[]

    constructor(private okrService: OkrService) {
        this.rootNode = new OkrNode(new Okr(''), [], true)
    }

    getOkrTree(): Observable<OkrNode> {
        return this.okrService.getOkrs().pipe(
            map((okrs: Okr[]) => {
                this.okrs = okrs
                this.initOkrTree()
                return this.rootNode
            })
        )
    }

    private initOkrTree() {
        let okrIds = this.okrs.map(okr => okr._id)
        let initlevelOkrs = this.okrs.filter(okr => !okr.parent || !okrIds.includes(okr.parent))
        this.rootNode.children = initlevelOkrs.map(okr => new OkrNode(okr, [], false))
        this.rootNode.children.forEach(node => {
            this.pushChildren(node)
        })
    }

    private pushChildren(okrNode: OkrNode) {
        okrNode.children = this.okrs.filter(okr => okr.parent === okrNode.okr._id)
            .map(okr => new OkrNode(okr, [], false))
        okrNode.children.forEach(childNode => this.pushChildren(childNode))
    }
}