import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface PhotoDB extends DBSchema {
  photos: {
    key: number;
    value: {
      data: Blob;
      createdAt: Date; // Timestamp when the photo was taken
    };
    indexes: { by_created_at: Date };
  };
}

@Injectable({
  providedIn: 'root'
})
export class PhotoStorageService {
  public dbPromise: Promise<IDBPDatabase<PhotoDB>> | null = null;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.dbPromise = openDB<PhotoDB>('photo-storage', 1, {
        upgrade(db) {
          const store = db.createObjectStore('photos', {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('by_created_at', 'createdAt');
        }
      });
    }
  }

  async addPhotoToDB(blob: Blob): Promise<void> {
    const db = await this.dbPromise;
    await db?.add('photos', { data: blob, createdAt: new Date() }) ?? Promise.reject('Database not initialized');

    // ✅ Try to register background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const reg = await navigator.serviceWorker.ready;
      try {
        await (reg as any).sync.register('photo-upload-sync');
        console.log('Background sync registered');
      } catch (err) {
        console.error('Sync registration failed', err);
        // Optional: fallback to immediate upload here
      }
    } else {
      console.warn('Background sync not supported');
      // Optional: fallback to immediate upload here
    }
  }

  // async getAllPhotos(): Promise<{ id: number; data: Blob; createdAt: Date }[]> {
  //   const db = await this.dbPromise;
  //   return db.getAll('photos');
  // }

  async deletePhoto(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db?.delete('photos', id);
  }

}
