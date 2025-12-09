import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PhotoStorageService } from './services/photo-storage.service';
import { NewPhotoStorageService } from './services/new-photo-storage.service';

@Component({
  selector: 'app-photo-booth',
  templateUrl: './photo-booth.component.html',
  styleUrls: ['./photo-booth.component.scss'],
})
export class PhotoBoothComponent implements AfterViewInit, OnInit {

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  photo: string | null = null;
  currentPhotoBlob: Blob | null = null;
  videoElement: HTMLVideoElement | null = null;
  picturePreviewModeSubject = new BehaviorSubject<boolean>(false);
  picturePreviewMode$ = this.picturePreviewModeSubject.asObservable();

  private readonly photoStorageService = inject(PhotoStorageService);
  private readonly newPhotoStorageService = inject(NewPhotoStorageService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
    this.initializeCamera();
  }

  private async initializeCamera(): Promise<void> {
    if (!this.videoRef || !isPlatformBrowser(this.platformId)) return;
    try {
      // Check if camera API is available
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not available');
      }
      this.videoElement = this.videoRef.nativeElement;
      const stream = await navigator.mediaDevices.getUserMedia({ 
        // video: { 
        //   width: { ideal: 1920 },    // Camera captures at 1920px wide
        //   height: { ideal: 1080 },    // Camera captures at 1080px tall
        //   frameRate: { ideal: 30, min: 24, max: 60 }, // Capture at 30fps, up to 60fps
        //   aspectRatio: { ideal: 16/9 }, // Maintain 16:9 aspect ratio
        //   facingMode: 'user',         // Front camera
        // }
        video: { 
          width: { ideal: 1440 },    // Portrait width
          height: { ideal: 1920 },   // Portrait height (3:4 aspect ratio)
          frameRate: { ideal: 30, min: 24, max: 60 },
          aspectRatio: { ideal: 3/4 }, // Portrait aspect ratio
          facingMode: 'user',
        }
      });
      this.videoElement.srcObject = stream;
    } catch (error) {
      console.error('Error initializing camera:', error);
    }
  }



// capture(): void {
//   if (!this.videoElement || !this.canvasRef) return;
//   const canvas = this.canvasRef.nativeElement;
//   const context = canvas.getContext('2d');
//   if (!context) return;

//   // Portrait aspect ratio (3:4)
//   const aspectRatio = 3 / 4;
//   const targetWidth = Math.floor(window.innerWidth * 0.95); // 95vw
//   const targetHeight = Math.floor(targetWidth / aspectRatio);

//   canvas.width = targetWidth;
//   canvas.height = targetHeight;

//   // Calculate scaling to fit the video into the canvas
//   const scale = Math.min(
//     targetWidth / this.videoElement.videoWidth,
//     targetHeight / this.videoElement.videoHeight
//   );

//   const drawWidth = this.videoElement.videoWidth * scale;
//   const drawHeight = this.videoElement.videoHeight * scale;
//   const dx = (targetWidth - drawWidth) / 2;
//   const dy = (targetHeight - drawHeight) / 2;

//   context.save();
//   context.scale(-1, 1); // Mirror horizontally
//   context.drawImage(
//     this.videoElement,
//     0, 0, this.videoElement.videoWidth, this.videoElement.videoHeight,
//     -dx - drawWidth, dy, drawWidth, drawHeight
//   );
//   context.restore();

//   this.picturePreviewModeSubject.next(true);
//   this.photo = canvas.toDataURL('image/png');
// }

  capture(): void {
    if (!this.videoElement || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Use the video stream's actual dimensions for sharpness
    const videoW = this.videoElement.videoWidth;
    const videoH = this.videoElement.videoHeight;

    // Optionally, clamp to a max size for performance
    const maxW = 1440, maxH = 1920;
    const scale = Math.min(maxW / videoW, maxH / videoH, 1);

    canvas.width = Math.floor(videoW * scale);
    canvas.height = Math.floor(videoH * scale);

    context.save();
    context.scale(-1, 1); // Mirror for selfie
    context.drawImage(
      this.videoElement,
      0, 0, videoW, videoH,
      -canvas.width, 0, canvas.width, canvas.height
    );
    context.restore();

    this.picturePreviewModeSubject.next(true);
    this.photo = canvas.toDataURL('image/png');
    // this.currentPhotoBlob = canvas.toBlob()
  }
  
  resetToCameraPreview(): void {
    this.picturePreviewModeSubject.next(false);
    this.photo = null;
    this.cdr.detectChanges(); // Ensure the view updates
    this.initializeCamera(); // Reinitialize camera to retake photo
  }

  flipCamera(): void {
    // Logic to flip the camera
  }

  previewLibrary(): void {
    // Logic to preview the photo in the library before sending
  }

  retake(): void {
   this.resetToCameraPreview();
  }

  saveImage(): void {
    if (!this.photo) return;
    // Logic to save the photo to user's device
    console.log('Photo saved:', this.photo);
  }

  sendImageToDB(): void {
    if (!this.photo) return;
    // Logic to send the photo to the server or another component
    // send photo to indexedDB
    const canvas = this.canvasRef.nativeElement;
    canvas.toBlob(async (blob) => {
      if (blob) {
        // await this.photoStorageService.addPhotoToDB(blob);
        await this.newPhotoStorageService.addPhoto(Date.now().toString(), blob);
      } else {
        console.error('Failed to convert canvas to Blob');
      }
    }, 'image/jpeg', 0.95);
    console.log('Photo sent:', this.photo);
    this.resetToCameraPreview(); // Reset after sending
  }

}
