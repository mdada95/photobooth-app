/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppSyncService } from './app-sync.service';

describe('Service: AppSync', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppSyncService]
    });
  });

  it('should ...', inject([AppSyncService], (service: AppSyncService) => {
    expect(service).toBeTruthy();
  }));
});
