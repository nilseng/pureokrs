import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as d3 from 'd3'
import { HierarchyNode, hierarchy } from 'd3-hierarchy'

import { AuthenticationService, UserDetails } from '../authentication.service'
import { OkrService } from '../okr.service'
import { Okr } from '../okr/okr'
import { OkrNode } from './okr-node/okr-node'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { OkrTreeService } from '../okr-tree.service'

@Component({
  templateUrl: './okr-list.component.html'
})
export class OkrListComponent implements OnInit {

  rootOkr: OkrNode
  root: HierarchyNode<OkrNode>

  newOKR: boolean
  user: UserDetails

  parentId: string
  okrNodeToEdit: Okr

  constructor(
    private auth: AuthenticationService,
    private okrTreeService: OkrTreeService) { }

  ngOnInit() {
    this.getRootOkr()
    this.newOKR = false
    this.getUserDetails()
    this.parentId = ''
  }

  getRootOkr() {
    this.okrTreeService.getOkrTree().subscribe(rootOkr => {
      this.rootOkr = rootOkr
      this.createHierarchy()
    })
  }

  createHierarchy() {
    this.root = hierarchy<OkrNode>(this.rootOkr)
  }

  getUserDetails(): void {
    this.user = this.auth.getUserDetails()
  }

  hideDeletedNode(okrHierarchyNode: HierarchyNode<OkrNode>) {
    if (okrHierarchyNode.children && okrHierarchyNode.children.length > 0) {
      this.rootOkr.children.push(...okrHierarchyNode.data.children)
    }
    okrHierarchyNode.parent.data.children.splice(okrHierarchyNode.parent.data.children.indexOf(okrHierarchyNode.data), 1)
    this.createHierarchy()
  }

  savedOkr(okr: Okr) {
    this.parentId = undefined
    if (okr.parent) {
      this.root.each((node) => {
        if (node.data.okr._id === okr.parent) {
          if (!node.children) node.children = []
          if (node.data.children.map(child => child.okr._id).indexOf(okr._id) === -1) {
            node.data.children.push(new OkrNode(okr))
          }
        }
      })
    } else {
      if (!this.rootOkr.children) this.rootOkr.children = []
      if (this.rootOkr.children.map(child => child.okr._id).indexOf(okr._id) === -1) {
        this.rootOkr.children.push(new OkrNode(okr))
      }
    }
    this.createHierarchy()
  }

  addChild(parentId: string) {
    this.parentId = parentId
  }

  editOkrNode(okr: Okr) {
    this.okrNodeToEdit = okr
  }

  clearParent() {
    this.parentId = undefined
  }
}
