/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewPhotoStorageService } from './new-photo-storage.service';

describe('Service: NewPhotoStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewPhotoStorageService]
    });
  });

  it('should ...', inject([NewPhotoStorageService], (service: NewPhotoStorageService) => {
    expect(service).toBeTruthy();
  }));
});
