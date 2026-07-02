import { Routes } from '@angular/router';
import { docenteGuard } from '../guards/docente.guard';

/** Rutas legacy Spring/Thymeleaf → SPA Angular (`/docente/*`). */
const DOCENTE_LEGACY_REDIRECTS: Routes = [
  { path: 'InterfazDocente/paneldocente', redirectTo: '/docente/dashboard', pathMatch: 'full' },
  { path: 'InterfazDocente/paneldocente.html', redirectTo: '/docente/dashboard', pathMatch: 'full' },
  { path: 'InterfazDocente/mis-cursos', redirectTo: '/docente/mis-cursos', pathMatch: 'full' },
  { path: 'InterfazDocente/MisCursos.html', redirectTo: '/docente/mis-cursos', pathMatch: 'full' },
  { path: 'InterfazDocente/tareas', redirectTo: '/docente/tareas', pathMatch: 'full' },
  { path: 'InterfazDocente/Tareas.html', redirectTo: '/docente/tareas', pathMatch: 'full' },
  { path: 'InterfazDocente/mensajes', redirectTo: '/docente/mensajes', pathMatch: 'full' },
  { path: 'InterfazDocente/Mensajes.html', redirectTo: '/docente/mensajes', pathMatch: 'full' },
  { path: 'InterfazDocente/foros', redirectTo: '/docente/foros', pathMatch: 'full' },
  { path: 'InterfazDocente/Foros.html', redirectTo: '/docente/foros', pathMatch: 'full' },
  { path: 'InterfazDocente/ForoDetalle.html', redirectTo: '/docente/foros', pathMatch: 'full' },
  { path: 'InterfazDocente/logout', redirectTo: '/auth/login', pathMatch: 'full' },
];

/**
 * Rutas del panel **Docente** (`/docente/*`).
 * Orden: rutas más específicas antes que las genéricas.
 */
export const DOCENTE_ROUTES: Routes = [
  ...DOCENTE_LEGACY_REDIRECTS,
  {
    path: 'docente/mis-cursos/:id/editar',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
    data: { mode: 'edit' },
  },
  {
    path: 'docente/mis-cursos',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
  },
  {
    path: 'docente/estudiantes',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
  },
  {
    path: 'docente/tareas',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
  },
  {
    path: 'docente/mensajes',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
  },
  {
    path: 'docente/foros/:id',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
  },
  {
    path: 'docente/foros',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
  },
  {
    path: 'docente/dashboard',
    loadComponent: () =>
      import('../components/docente-layout/docente-layout.component').then(
        (m) => m.DocenteLayoutComponent,
      ),
    canActivate: [docenteGuard],
  },
  {
    path: 'docente',
    pathMatch: 'full',
    redirectTo: '/docente/dashboard',
  },
];

