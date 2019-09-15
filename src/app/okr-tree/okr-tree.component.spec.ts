import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrTreeComponent } from './okr-tree.component';

describe('OkrTreeComponent', () => {
  let component: OkrTreeComponent;
  let fixture: ComponentFixture<OkrTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkrTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
