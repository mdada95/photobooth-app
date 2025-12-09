import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome-page/welcome-page.module').then(m => m.WelcomePageModule) },
  { path: 'photobooth', loadChildren: () => import('./pages/photo-booth/photo-booth.module').then(m => m.PhotoBoothModule) },
];
