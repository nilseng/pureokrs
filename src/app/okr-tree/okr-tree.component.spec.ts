import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OkrTreeComponent } from './okr-tree.component'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthenticationService, UserDetails } from '../authentication.service'
import { of } from 'rxjs'
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'

describe('OkrTreeComponent', () => {
  let component: OkrTreeComponent
  let fixture: ComponentFixture<OkrTreeComponent>
  let authSpy;
  let route: ActivatedRoute
  let snapshot: ActivatedRouteSnapshot

  beforeEach(async(() => {
    authSpy = jasmine.createSpyObj('AuthenticationService', ['getUserDetails', 'getToken'])

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ OkrTreeComponent ],
      providers: [
        {provide: AuthenticationService, useValue: authSpy},
        {provide: ActivatedRoute, useValue: {snapshot:{data:{okrs: []}}}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    authSpy.getUserDetails.and.returnValue(of(<UserDetails>{company: 'Testing AS'}))
    fixture = TestBed.createComponent(OkrTreeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
