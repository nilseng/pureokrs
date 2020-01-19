import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrNodeComponent } from './okr-node.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Okr } from '../../okr/okr';

describe('OkrComponent', () => {
  let component: OkrNodeComponent;
  let fixture: ComponentFixture<OkrNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ OkrNodeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrNodeComponent);
    component = fixture.componentInstance;
    component.okr = <Okr>{_id: 'kjdsfh', children: []};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
