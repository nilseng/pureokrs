import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, Subject } from 'rxjs'
import {
  debounceTime, distinctUntilChanged, switchMap, map
} from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { Okr, KeyResult } from '../okr'
import { OkrService } from '../../okr.service'
import { AuthenticationService, UserDetails } from '../../authentication.service'
import { UserService } from '../../user.service'
import { HierarchyNode } from 'd3'
import { OkrNode } from '../okr-node'

@Component({
  selector: 'app-edit-okr',
  templateUrl: './edit-okr.component.html',
  styleUrls: ['./edit-okr.component.css']
})
export class EditOkrComponent implements OnChanges {

  faPlusCircle = faPlusCircle
  faTrashAlt = faTrashAlt

  @Input() okrHierarchyNode: HierarchyNode<OkrNode>
  @Output() savedOkr = new EventEmitter<Okr>()

  noObjective: boolean

  //Variables for searching for OKR owner
  users$: Observable<UserDetails[]>
  private ownerSearchTerms = new Subject<string>()
  owner: UserDetails

  //Variables for searching for OKR parent
  parents$: Observable<Okr[]>
  private parentSearchTerms = new Subject<string>()
  parent: Okr
  descendants: string[]

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // Push a owner search term into the observable stream.
  ownerSearch(term: string): void {
    this.ownerSearchTerms.next(term)
  }

  // Push a parent OKR search term into the observable stream.
  parentSearch(term: string): void {
    this.parentSearchTerms.next(term)
  }

  ngOnChanges() {
    this.userService.getUser(this.okrHierarchyNode.data.okr.userId)
      .subscribe(owner => this.owner = owner)
    this.parent = this.okrHierarchyNode.parent.data.okr
    this.noObjective = false
    this.descendants = this.okrHierarchyNode.descendants().map(okr => okr.data.okr._id)

    this.users$ = this.ownerSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.searchUsers(term))
    )

    this.parents$ = this.parentSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.okrService.searchOkrs(term)),
      map(parents => parents.filter(parent => !this.descendants.includes(parent._id) && parent._id !== this.okrHierarchyNode.data.okr.parent))
    )
  }

  save(): void {
    if (!this.okrHierarchyNode.data.okr.objective.trim()) {
      this.noObjective = true
      return
    } else {
      this.okrService.updateOkr(this.okrHierarchyNode.data.okr)
        .subscribe((okr: Okr) => {
          if (okr.parent && okr.parent !== this.okrHierarchyNode.parent.data.okr._id) {
            this.changeParent(okr)
          } else {
            this.clearForm()
            this.savedOkr.emit(okr)
          }
        })
    }
  }

  clearParent() {
    this.parent = undefined
  }

  addKeyResult(): void {
    this.okrHierarchyNode.data.okr.keyResults.push(new KeyResult(''))
  }

  removeKeyResult(index: number): void {
    this.okrHierarchyNode.data.okr.keyResults.splice(index, 1)
  }

  changeParent(okr: Okr) {
    this.okrHierarchyNode.parent.data.children
      .splice(this.okrHierarchyNode.parent.data.children.indexOf(this.okrHierarchyNode.data), 1)
    if (this.okrHierarchyNode.parent.depth === 0) {
      this.addChildToParent(okr)
    } else {
      this.okrService.removeChild(this.okrHierarchyNode.parent.data.okr._id, okr._id)
        .subscribe(() => {
          this.addChildToParent(okr)
        })
    }
  }

  addChildToParent(child: Okr) {
    this.okrService.addChild(child.parent, child._id)
      .subscribe(() => {
        this.clearForm()
        this.savedOkr.emit(child)
      })
  }

  assign(owner: UserDetails): void {
    this.okrHierarchyNode.data.okr.userId = owner._id
    this.owner = owner
    this.ownerSearch('')
  }

  link(parent: Okr): void {
    this.okrHierarchyNode.data.okr.parent = parent._id
    this.parent = parent
    this.parentSearch('')
  }

  clearForm() {
    this.auth.getUserDetails().subscribe(
      u => this.owner = u
    )
    this.parent = undefined
    this.noObjective = false
  }
}