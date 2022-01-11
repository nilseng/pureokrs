import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NewUserComponent } from './new-user.component'
import { FormsModule } from '@angular/forms'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthenticationService, UserDetails } from 'src/app/authentication.service'
import { of } from 'rxjs'

describe('NewUserComponent', () => {
  let component: NewUserComponent
  let fixture: ComponentFixture<NewUserComponent>
  let authSpy

  beforeEach(async(() => {
    authSpy = jasmine.createSpyObj('AuthenticationService', ['getUserDetails'])
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ NewUserComponent ],
      providers: [
        {provide: AuthenticationService, useValue: authSpy}
      ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    authSpy.getUserDetails.and.returnValue(of(<UserDetails>{company: 'Testing AS'}))
    fixture = TestBed.createComponent(NewUserComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
