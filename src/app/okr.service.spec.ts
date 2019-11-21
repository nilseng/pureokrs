import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import { OkrService } from './okr.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('OkrService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ]
  }));

  it('should be created', () => {
    const service: OkrService = TestBed.get(OkrService);
    expect(service).toBeTruthy();
  });
});
