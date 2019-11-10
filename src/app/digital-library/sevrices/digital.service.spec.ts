import { TestBed } from '@angular/core/testing';

import { DigitalService } from './digital.service';

describe('DigitalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitalService = TestBed.get(DigitalService);
    expect(service).toBeTruthy();
  });
});
