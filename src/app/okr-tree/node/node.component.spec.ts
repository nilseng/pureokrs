import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NodeComponent } from './node.component';
import { Okr } from 'src/app/okr/okr';
import { Node } from './node';
import { HierarchyPointNode } from 'd3';
import { Edge } from '../edge/edge';
import { OkrService } from 'src/app/okr.service';


describe('NodeComponent', () => {

  let component: NodeComponent;
  let okrService: OkrService

  beforeEach(() => {
    component = new NodeComponent(okrService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
