import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeComponent } from './edge.component';
import { HierarchyPointNode } from 'd3';
import { Node } from '../node/node';

describe('EdgeComponent', () => {
  let component: EdgeComponent;
  let fixture: ComponentFixture<EdgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EdgeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeComponent);
    component = fixture.componentInstance;
    component.edge = {
      source: <HierarchyPointNode<Node>>{
        x: 0,
        y: 0
      },
      target: <HierarchyPointNode<Node>>{
        x:0,
        y: 0
      }
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
