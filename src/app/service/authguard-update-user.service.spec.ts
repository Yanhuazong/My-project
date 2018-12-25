import { TestBed, inject } from '@angular/core/testing';

import { AuthguardUpdateUserService } from './authguard-update-user.service';

describe('AuthguardUpdateUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthguardUpdateUserService]
    });
  });

  it('should be created', inject([AuthguardUpdateUserService], (service: AuthguardUpdateUserService) => {
    expect(service).toBeTruthy();
  }));
});
