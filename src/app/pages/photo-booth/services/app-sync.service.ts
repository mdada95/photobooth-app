import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { NewPhotoStorageService } from './new-photo-storage.service';
import { PhotoUploadService } from './photo-upload.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AppSyncService {
  private syncInterval: any;

  constructor(
    private photoStorage: NewPhotoStorageService,
    private uploader: PhotoUploadService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {};

  startSync(): void {
    if(!isPlatformBrowser(this.platformId)) return; // only run in browser

    if ('serviceWorker' in navigator) console.log('Service Worker is available'); // let Workbox/service worker handle it

    console.log('start syncs is called');

    this.ngZone.runOutsideAngular(() => {
      console.log('Inside ngZone.runOutsideAngular');
      this.syncInterval = setInterval(() => {
        console.log('Sync interval triggered'); 
        if (!navigator.onLine) console.log('Offline, skipping sync');

        // this.photoStorage.getPendingPhotos().then(pendingPhotos => {
        //   pendingPhotos.forEach(async (photo) => {
        //     try {
        //       await this.uploader.uploadPhoto(photo.blob);
        //       await this.photoStorage.markAsUploaded(photo.id);
        //     } catch (err) {
        //       console.error('Upload failed for photo', photo.id);
        //     }
        //   });
        // });
      }, 60000); // every 1 minute
    });
  }

  stopSync(): void {
    console.log('Stopping sync');
    clearInterval(this.syncInterval);
  }
}
