import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/components/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { ADMIN_ROUTES } from './core/routing/admin.routes';
import { DOCENTE_ROUTES } from './core/routing/docente.routes';
import { ESTUDIANTE_ROUTES } from './core/routing/estudiante.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  ...ADMIN_ROUTES,
  ...DOCENTE_ROUTES,
  ...ESTUDIANTE_ROUTES,
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./users/users').then((m) => m.Users),
      },
      {
        path: 'roles',
        loadComponent: () => import('./roles/roles').then((m) => m.Roles),
      },
      {
        path: 'modules',
        loadComponent: () => import('./modules/modules').then((m) => m.Modules),
      },
      {
        path: 'curso',
        loadComponent: () => import('./curso/curso').then((m) => m.Curso),
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
