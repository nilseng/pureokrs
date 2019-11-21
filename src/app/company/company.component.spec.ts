import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyComponent } from './company.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../authentication.service';
import { of } from 'rxjs';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async(() => {
    let authSpy = jasmine.createSpyObj('AuthenticationService', ['getUserDetails']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ CompanyComponent ],
      providers: [{provide: AuthenticationService, useValue: authSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    authenticationService = TestBed.get(AuthenticationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
