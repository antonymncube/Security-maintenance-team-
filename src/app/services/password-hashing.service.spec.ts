import { TestBed } from '@angular/core/testing';

import { PasswordHashingService } from './password-hashing.service';

describe('PasswordHashingService', () => {
  let service: PasswordHashingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordHashingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
