import { TestBed } from '@angular/core/testing';

import { BookActionService } from './book-action.service';

describe('BookActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookActionService = TestBed.get(BookActionService);
    expect(service).toBeTruthy();
  });
});
