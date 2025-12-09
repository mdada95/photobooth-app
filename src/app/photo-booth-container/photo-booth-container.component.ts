import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-photo-booth-container',
  templateUrl: './photo-booth-container.component.html',
  styleUrls: ['./photo-booth-container.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PhotoBoothContainerComponent implements AfterViewInit, OnInit {

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  photo: string | null = null;
  videoElement: HTMLVideoElement | null = null;

  constructor() { }

  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
    if (!this.videoRef) return;
    this.videoElement = this.videoRef.nativeElement;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const videoElement = this.videoRef.nativeElement;
        videoElement.srcObject = stream;
      })
      .catch(error => console.error('Camera access is denied:', error));
  }

  capture(): void {
    if (!this.videoElement || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    
    this.photo = canvas.toDataURL('image/png');
  }

}
