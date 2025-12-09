import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoBoothComponent } from './photo-booth.component';
import { PhotoBoothRoutingModule } from './photo-booth.routing.module';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PhotoBoothRoutingModule,
  ],
  declarations: [PhotoBoothComponent]
})
export class PhotoBoothModule { }
