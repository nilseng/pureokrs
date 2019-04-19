import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOkrComponent } from './edit-okr.component';

describe('EditOkrComponent', () => {
  let component: EditOkrComponent;
  let fixture: ComponentFixture<EditOkrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOkrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOkrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
