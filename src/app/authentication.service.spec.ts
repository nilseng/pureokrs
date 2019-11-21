import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService,
  mockRouter, mockHttp;

  beforeEach(() => {
    authenticationService = new AuthenticationService(mockHttp, mockRouter);
  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });
});
