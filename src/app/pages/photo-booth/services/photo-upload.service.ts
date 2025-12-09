import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {

  private readonly httpClient = inject(HttpClient);

  private readonly cloudName = 'de38ndf2u';
  private readonly uploadPreset = 'cloud_s_and_y';

  get apiUrl(): string {
    return `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  }

  uploadPhoto(file: Blob): Observable<HttpEvent<any>> {
    console.log('Uploading photo...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.httpClient.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadFromIDB(blob: Blob): Promise<Response> {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', environment.uploadPreset);

    return fetch(environment.cloudinaryUrl, {
      method: 'POST',
      body: formData
    });
  }

}
