import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeVisualComponent } from './tree-visual.component';

describe('TreeVisualComponent', () => {
  let component: TreeVisualComponent;
  let fixture: ComponentFixture<TreeVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
