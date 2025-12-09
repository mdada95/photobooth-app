import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoBoothComponent } from './photo-booth.component';

export const routes: Routes = [
  {
    path: '',
    component: PhotoBoothComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoBoothRoutingModule { }
