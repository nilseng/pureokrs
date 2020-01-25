import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import {
  faPlusCircle, faPen, faTrashAlt, faUserNinja,
  faBatteryEmpty, faAdjust, faCheckCircle,
  faChevronUp, faChevronDown
}
  from '@fortawesome/free-solid-svg-icons'

import { OkrService } from '../../okr.service'
import { AuthenticationService, UserDetails } from '../../authentication.service'
import { UserService } from '../../user.service'
import { OkrNode } from './okr-node'
import { HierarchyNode } from 'd3'

@Component({
  selector: 'app-okr-node',
  templateUrl: './okr-node.component.html',
  styleUrls: ['./okr-node.component.css']
})

export class OkrNodeComponent implements OnChanges {

  faPlusCircle = faPlusCircle
  faPen = faPen
  faTrashAlt = faTrashAlt
  faUserNinja = faUserNinja
  faBatteryEmpty = faBatteryEmpty
  faAdjust = faAdjust
  faCheckCircle = faCheckCircle
  faChevronUp = faChevronUp
  faChevronDown = faChevronDown

  @Input() okrHierarchyNode: HierarchyNode<OkrNode>
  @Output() deletedNode = new EventEmitter<HierarchyNode<OkrNode>>()
  @Output() parentId = new EventEmitter<string>()
  @Output() okrNodeToEdit = new EventEmitter<HierarchyNode<OkrNode>>()

  keyResults: {}
  owner: UserDetails
  parent: OkrNode
  children: {}
  childrenCount: number
  averageProgress: number

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnChanges() {
    this.getOwner()
    this.getAverageProgress()
  }

  addChild(parentId: string) {
    this.parentId.emit(parentId)
  }

  editOkrNode(okrNode: HierarchyNode<OkrNode>){
    this.okrNodeToEdit.emit(okrNode)
  }

  showChildren(){
    this.okrHierarchyNode.data.isChildrenVisible = true
  }

  hideChildren(): void {
    this.okrHierarchyNode.data.isChildrenVisible = false
  }

  getAverageProgress() {
    let sum = 0
    let count = 0
    this.okrHierarchyNode.data.okr.keyResults
      .forEach(kr => {
        if (kr.progress) {
          sum += kr.progress
        }
        count += 1
      })
    this.averageProgress = Math.round(sum / count)
  }

  getOwner() {
    if (this.okrHierarchyNode.data.okr.userId) {
      this.userService.getUser(this.okrHierarchyNode.data.okr.userId)
        .subscribe(owner => {
          this.owner = owner
        })
    }
  }

  deleteOKR() {
    this.okrService.deleteOkr(this.okrHierarchyNode.data.okr)
      .subscribe(() => this.hideDeletedNode(this.okrHierarchyNode))
  }

  hideDeletedNode(okrHierarchyNode: HierarchyNode<OkrNode>){
    this.deletedNode.emit(okrHierarchyNode)
  }
}