/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PhotoStorageService } from './photo-storage.service';

describe('Service: PhotoStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoStorageService]
    });
  });

  it('should ...', inject([PhotoStorageService], (service: PhotoStorageService) => {
    expect(service).toBeTruthy();
  }));
});
