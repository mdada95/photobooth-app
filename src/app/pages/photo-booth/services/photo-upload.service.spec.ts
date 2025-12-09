/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PhotoUploadService } from './photo-upload.service';

describe('Service: PhotoUpload', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoUploadService]
    });
  });

  it('should ...', inject([PhotoUploadService], (service: PhotoUploadService) => {
    expect(service).toBeTruthy();
  }));
});
