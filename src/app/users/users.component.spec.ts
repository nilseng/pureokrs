import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UsersComponent } from './users.component'
import { FormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { of } from 'rxjs'
import { UserDetails, AuthenticationService } from '../authentication.service'

describe('UsersComponent', () => {
  let component: UsersComponent
  let fixture: ComponentFixture<UsersComponent>
  let authSpy

  beforeEach(async(() => {
    authSpy = jasmine.createSpyObj('AuthenticationService', ['getUserDetails'])
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ UsersComponent ],
      providers: [
        {provide: AuthenticationService, useValue: authSpy}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    authSpy.getUserDetails.and.returnValue(of(<UserDetails>{company: 'Testing AS'}))
    fixture = TestBed.createComponent(UsersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
