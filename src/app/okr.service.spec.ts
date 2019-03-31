import { TestBed } from '@angular/core/testing';

import { OkrService } from './okr.service';

describe('OkrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OkrService = TestBed.get(OkrService);
    expect(service).toBeTruthy();
  });
});
