import { Routes } from '@angular/router';
import { SlideHostComponent } from './deck/slide-host.component';

export const routes: Routes = [
  { path: '', redirectTo: '/slide/0', pathMatch: 'full' },
  { path: 'slide/:index', component: SlideHostComponent },
  { path: '**', redirectTo: '/slide/0' },
];
