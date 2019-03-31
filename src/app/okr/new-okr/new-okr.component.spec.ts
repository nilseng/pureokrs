import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOkrComponent } from './new-okr.component';

describe('NewOkrComponent', () => {
  let component: NewOkrComponent;
  let fixture: ComponentFixture<NewOkrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOkrComponent ]
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
