import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOkrComponent } from './new-okr.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from 'src/app/authentication.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NewOkrComponent', () => {
  let component: NewOkrComponent;
  let fixture: ComponentFixture<NewOkrComponent>;

  beforeEach(async(() => {
    const mockAuthService = {
      getUserDetails: () => {
        return {_id: 'kasjfh'}
      }
    }
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ NewOkrComponent ],
      providers: [
        {provide: AuthenticationService, useValue: mockAuthService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOkrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
