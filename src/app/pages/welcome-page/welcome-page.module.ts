import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './welcome-page.component';
import { WelcomePageRoutingModule } from './welcome-page.routing.module';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    WelcomePageRoutingModule,
    MaterialModule
  ],
  declarations: [WelcomePageComponent]
})
export class WelcomePageModule { }
