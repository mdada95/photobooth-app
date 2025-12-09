/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PhotoRetrievalService } from './photo-retrieval.service';

describe('Service: PhotoRetrieval', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoRetrievalService]
    });
  });

  it('should ...', inject([PhotoRetrievalService], (service: PhotoRetrievalService) => {
    expect(service).toBeTruthy();
  }));
});
