import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { isPlatformBrowser } from '@angular/common';
import { PhotoUploadService } from './photo-upload.service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

interface PhotoEntry {
  id: string;
  blob: Blob;
  timestamp: number;
  isUploaded: boolean;
}

interface PhotoDB extends DBSchema {
  photos: {
    key: string;
    value: PhotoEntry;
  };
}

@Injectable({ providedIn: 'root' })
export class NewPhotoStorageService {
  private dbPromise: Promise<IDBPDatabase<PhotoDB>> | null = null;
  private readonly uploader = inject(PhotoUploadService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.dbPromise = openDB<PhotoDB>('photo-db', 1, {
        upgrade(db) {
          db.createObjectStore('photos', { keyPath: 'id' });
        },
      });
    }
  }

  async addPhoto(id: string, blob: Blob): Promise<void> {
    console.log('Adding photo to storage:', id);
    const db = await this.dbPromise;
    await db?.add('photos', { id, blob, timestamp: Date.now(), isUploaded: false });
    console.log('Photo added:', id);

    // test photo upload
    await lastValueFrom(this.uploader.uploadPhoto(blob));
  }

  async getPendingPhotos(): Promise<PhotoEntry[]> {
    const db = await this.dbPromise;
    const all = await db?.getAll('photos');
    return all?.filter(p => !p.isUploaded) || [];
  }

  async markAsUploaded(id: string): Promise<void> {
    const db = await this.dbPromise;
    const photo = await db?.get('photos', id);
    if (photo) {
      photo.isUploaded = true;
      await db?.put('photos', photo);
    }
  }

  async deletePhoto(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db?.delete('photos', id);
  }
}
