import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../components/admin-layout/admin-layout.component';
import { adminGuard } from '../guards/admin.guard';

/**
 * Rutas del panel **Administrador** (`/admin/*`).
 * Orden: rutas más específicas antes que las genéricas.
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/cursos/nuevo',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    data: { mode: 'create' },
  },
  {
    path: 'admin/cursos/:id/editar',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    data: { mode: 'edit' },
  },
  {
    path: 'admin/cursos',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/mensajes',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/docentes',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/usuarios',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/dashboard',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: '/admin/dashboard',
  },
];

