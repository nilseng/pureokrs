import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'

import { EditOkrComponent } from './edit-okr.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of } from 'rxjs'
import { UserDetails } from 'src/app/authentication.service'
import * as d3 from 'd3'
import { OkrNode } from 'src/app/okr-list/okr-node/okr-node'
import { Okr } from '../okr'

describe('EditOkrComponent', () => {
  let component: EditOkrComponent
  let fixture: ComponentFixture<EditOkrComponent>
  let authSpy: any

  beforeEach(async(() => {
    authSpy = jasmine.createSpyObj('AuthenticationService', ['getUser', 'getToken'])

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [EditOkrComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    authSpy.getUser.and.returnValue(of(<UserDetails>{company: 'Testing AS'}))
    fixture = TestBed.createComponent(EditOkrComponent)
    component = fixture.componentInstance
    component.okrHierarchyNode = d3.hierarchy(new OkrNode(new Okr('')))
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
