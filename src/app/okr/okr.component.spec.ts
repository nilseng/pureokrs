import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrComponent } from './okr.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Okr } from './okr';

describe('OkrComponent', () => {
  let component: OkrComponent;
  let fixture: ComponentFixture<OkrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ OkrComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrComponent);
    component = fixture.componentInstance;
    component.okr = <Okr>{_id: 'kjdsfh', children: []};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
