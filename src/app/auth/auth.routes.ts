import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./log-in/log-in.component').then(m => m.LogIn)
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register').then(m => m.Register)
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./sign-in/sign-in').then(m => m.SignIn)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];