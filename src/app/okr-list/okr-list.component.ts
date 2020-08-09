import { Component, OnInit } from '@angular/core'
import { HierarchyNode } from 'd3-hierarchy'

import { AuthenticationService } from '../authentication.service'
import { OkrService } from '../okr.service'
import { Okr } from '../okr/okr'
import { OkrNode } from '../okr/okr-node'

@Component({
  templateUrl: './okr-list.component.html'
})
export class OkrListComponent implements OnInit {

  okrTree$ = this.okrService.okrTreeWithActions$
  okrTreeIsLoading$ = this.okrService.okrTreeIsLoading$

  newOKR: boolean
  user$ = this.auth.getUserDetails()

  parentId: string
  okrNodeToEdit: OkrNode

  constructor(
    private auth: AuthenticationService,
    private okrService: OkrService) { }

  ngOnInit() {
    this.newOKR = false
    this.parentId = ''
  }

  hideDeletedNode(deletedOkr: HierarchyNode<OkrNode>) {
    this.okrService.okrDeleted(deletedOkr)
  }

  savedOkr(okr: Okr) {
    this.okrService.okrSaved(okr)
    this.clearParent()
  }

  addChild(parentId: string) {
    this.parentId = parentId
  }

  editOkrNode(okr: OkrNode) {
    this.okrNodeToEdit = okr
  }

  clearParent() {
    this.parentId = undefined
  }
}
