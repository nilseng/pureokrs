import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable, Subject } from 'rxjs'
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators'
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { Okr, KeyResult } from '../okr'
import { OkrService } from '../../okr.service'
import { AuthenticationService, UserDetails } from '../../authentication.service'
import { UserService } from '../../user.service'

@Component({
  selector: 'app-new-okr',
  templateUrl: './new-okr.component.html',
  styleUrls: ['./new-okr.component.css']
})
export class NewOkrComponent implements OnInit, OnChanges {
  faPlusCircle = faPlusCircle
  faTrashAlt = faTrashAlt

  @Input() parentId: string
  @Output() savedOkr = new EventEmitter<Okr>()
  @Output() clearParent = new EventEmitter()

  @ViewChild('parentSearchBox', { static: false }) parentSearchEl: ElementRef
  @ViewChild('ownerSearchBox', { static: false }) ownerSearchEl: ElementRef

  okr: Okr
  krCount: number

  noObjective: boolean

  //Variables for searching for OKR owner
  users$: Observable<{}>
  private ownerSearchTerms = new Subject<string>()
  owner: UserDetails

  //Variables for searching for OKR parent
  parents$: Observable<{}>
  private parentSearchTerms = new Subject<string>()
  parent: Okr

  constructor(
    private okrService: OkrService,
    private auth: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.okr = new Okr('')
    this.okr.keyResults.push(new KeyResult(''))
    this.auth.getUserDetails().subscribe(
      u => {
        this.owner = u
        this.okr.userId = u._id
      }
    )

    this.getParent()

    this.noObjective = false

    this.users$ = this.ownerSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.searchUsers(term)),
    )

    this.parents$ = this.parentSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.okrService.searchOkrs(term)),
    )
  }

  ngOnChanges() {
    this.okr = new Okr('')
    this.okr.objective = ''
    this.okr.keyResults = []
    this.okr.keyResults.push(new KeyResult(''))
    this.auth.getUserDetails().subscribe(
      u => {
        this.owner = u
        this.okr.userId = u._id
      }
    )
    this.noObjective = false
    this.getParent()
  }

  ownerSearch(term: string): void {
    this.ownerSearchTerms.next(term)
  }

  parentSearch(term: string): void {
    this.parentSearchTerms.next(term)
  }

  save(): void {
    this.parentSearch('')
    this.ownerSearch('')
    if (!this.okr.objective.trim()) {
      this.noObjective = true
      return
    } else {
      this.okrService.createOkr(this.okr)
        .subscribe((okr: Okr) => {
          if (okr.parent) {
            this.addToParentOnSave(okr)
          } else {
            this.savedOkr.emit(okr)
          }
          this.clearForm()
        })
    }
  }

  getParent() {
    if (this.parentId) {
      this.okrService.getOkr(this.parentId)
        .subscribe((okr: Okr) => {
          this.parent = okr
          this.okr.parent = okr._id
        })
    }
  }

  addKeyResult(): void {
    this.okr.keyResults.push(new KeyResult(''))
  }

  removeKeyResult(id: string, index: number): void {
    this.okr.keyResults.splice(index, 1)
  }

  addToParentOnSave(okr: Okr) {
    this.okrService.addChild(okr.parent, okr._id)
      .subscribe(() => {
        this.savedOkr.emit(okr)
      })
  }

  assign(owner: UserDetails): void {
    this.okr.userId = owner._id
    this.owner = owner
    this.ownerSearch('')
  }

  link(parent: Okr): void {
    this.okr.parent = parent._id
    this.parent = parent
    this.parentSearch('')
  }

  clearForm() {
    this.okr = new Okr('')
    this.okr.objective = ''
    this.okr.keyResults = []
    this.okr.keyResults.push(new KeyResult(''))
    this.auth.getUserDetails().subscribe(
      u => {
        this.owner = u
        this.okr.userId = u._id
      }
    )
    this.parent = undefined
    this.clearParent.emit()
    this.noObjective = false
  }
}
