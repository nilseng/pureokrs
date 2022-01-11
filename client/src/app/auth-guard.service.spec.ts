import { TestBed } from '@angular/core/testing'

import { AuthGuardService } from './auth-guard.service'

describe('AuthGuardService', () => {

  let authGuardService: AuthGuardService
  let mockAuthService, mockRouter

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('mockAuthService', ['getToken', 'isLoggedIn'])
    authGuardService = new AuthGuardService(mockAuthService, mockRouter)
  })

  it('should be created', () => {
    expect(authGuardService).toBeTruthy()
  })

  it('#canActivate should return true if the user is logged in', ()=>{
    //Check that canActivate returns true if auth.isLoggedIn() returns true and else false
    
  })
})
