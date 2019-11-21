import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';

describe('AuthGuardService', () => {

  let authGuardService: AuthGuardService;
  let mockAuthService, mockRouter;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('mockAuthService', ['getToken']);
    authGuardService = new AuthGuardService(mockAuthService, mockRouter);
  });

  it('should be created', () => {
    expect(authGuardService).toBeTruthy();
  });
});
