import { inject, Injectable } from '@angular/core';
import { PhotoStorageService } from './photo-storage.service';
import { PhotoUploadService } from './photo-upload.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoRetrievalService {

  private readonly photoUploadService = inject(PhotoUploadService);
  private readonly photoStorageService = inject(PhotoStorageService);

  async retrievePhotosForUpload() {
    if (!this.photoStorageService.dbPromise) {
      throw new Error('Database not initialized');
    }

    const db = await this.photoStorageService.dbPromise;
    const tx = db.transaction('photos', 'readwrite');
    const store = tx.objectStore('photos');

    // Use a cursor to get both value and key (id)
    let cursor = await store.openCursor();
    while (cursor) {
      const photo = cursor.value;
      const id = cursor.primaryKey as number;
      console.log('Photo to upload:', photo);
      try {
        await this.photoUploadService.uploadFromIDB(photo.data);
        await cursor.delete();
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
      cursor = await cursor.continue();
    }
    await tx.done;
  }

}
