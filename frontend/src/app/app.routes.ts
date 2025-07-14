import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  // Rotas simples temporárias para não dar erro
  {
    path: 'auth',
    redirectTo: '/dashboard' // Por enquanto redireciona
  },
  {
    path: 'produtos', 
    redirectTo: '/dashboard' // Por enquanto redireciona
  },
  {
    path: 'estoque',
    redirectTo: '/dashboard' // Por enquanto redireciona
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
