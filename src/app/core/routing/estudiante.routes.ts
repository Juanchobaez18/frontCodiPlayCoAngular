import { Routes } from '@angular/router';
import { estudiantePanelGuard } from '../guards/estudiante-panel.guard';

/** Rutas legacy Spring → SPA (`/estudiante/*`). */
const ESTUDIANTE_LEGACY_REDIRECTS: Routes = [
  { path: 'PanelControlUsuario/inicio', redirectTo: '/estudiante/inicio', pathMatch: 'full' },
  { path: 'PanelControlUsuario/mis_cursos', redirectTo: '/estudiante/mis-cursos', pathMatch: 'full' },
  { path: 'PanelControlUsuario/mis_logros', redirectTo: '/estudiante/mis-logros', pathMatch: 'full' },
  { path: 'PanelControlUsuario/bandeja', redirectTo: '/estudiante/bandeja', pathMatch: 'full' },
  { path: 'PanelControlUsuario/foros', redirectTo: '/estudiante/foros', pathMatch: 'full' },
  { path: 'PanelControlUsuario/forosListado', redirectTo: '/estudiante/foros', pathMatch: 'full' },
  { path: 'PanelControlUsuario/editar-perfil', redirectTo: '/estudiante/editar-perfil', pathMatch: 'full' },
  { path: 'PanelControlUsuario/soporte', redirectTo: '/estudiante/soporte', pathMatch: 'full' },
  { path: 'PanelControlUsuario/modulo1', redirectTo: '/estudiante/modulo-panel/1', pathMatch: 'full' },
  { path: 'PanelControlUsuario/modulo2', redirectTo: '/estudiante/modulo-panel/2', pathMatch: 'full' },
  { path: 'PanelControlUsuario/modulo3', redirectTo: '/estudiante/modulo-panel/3', pathMatch: 'full' },
  { path: 'PanelControlUsuario/modulo4', redirectTo: '/estudiante/modulo-panel/4', pathMatch: 'full' },
  { path: 'estudiante/modulo/1', redirectTo: '/estudiante/modulo-panel/1', pathMatch: 'full' },
  { path: 'estudiante/modulo/2', redirectTo: '/estudiante/modulo-panel/2', pathMatch: 'full' },
  { path: 'estudiante/modulo/3', redirectTo: '/estudiante/modulo-panel/3', pathMatch: 'full' },
  { path: 'estudiante/modulo/4', redirectTo: '/estudiante/modulo-panel/4', pathMatch: 'full' },
];

const loadEstudianteLayout = () =>
  import('../components/estudiante-layout/estudiante-layout.component').then(
    (m) => m.EstudianteLayoutComponent,
  );

export const ESTUDIANTE_ROUTES: Routes = [
  ...ESTUDIANTE_LEGACY_REDIRECTS,
  {
    path: 'estudiante/foros/:id',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/leccion-panel/:modulo/:leccion',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/modulo-panel/:num',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/modulo/:id',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/modulo-lista/:cursoId',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/leccion/:id',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/inicio',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/mis-cursos',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/mis-logros',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/bandeja',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/foros',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/editar-perfil',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante/soporte',
    loadComponent: loadEstudianteLayout,
    canActivate: [estudiantePanelGuard],
  },
  {
    path: 'estudiante',
    pathMatch: 'full',
    redirectTo: '/estudiante/inicio',
  },
];

