import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrmapComponent } from './okrmap.component';

describe('OkrmapComponent', () => {
  let component: OkrmapComponent;
  let fixture: ComponentFixture<OkrmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkrmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
