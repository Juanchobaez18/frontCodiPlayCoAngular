import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/components/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { ADMIN_ROUTES } from './core/routing/admin.routes';
import { DOCENTE_ROUTES } from './core/routing/docente.routes';
import { ESTUDIANTE_ROUTES } from './core/routing/estudiante.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing-page/landing-page').then(m => m.LandingPage)
    },
    {
        path: 'cursos',
        loadComponent: () => import('./features/cursos/cursos').then(m => m.CursosComponent)
    },
    {
        path: 'quienes-somos',
        loadComponent: () => import('./features/quienes-somos/quienes-somos').then(m => m.QuienesSomosComponent)
    },
    {
        path: 'preguntas-frecuentes',
        loadComponent: () => import('./features/preguntas-frecuentes/preguntas-frecuentes').then(m => m.PreguntasFrecuentesComponent)
    },
    {
        path: 'contacto',
        loadComponent: () => import('./features/contacto/contacto').then(m => m.ContactoComponent)
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    ...ADMIN_ROUTES,
    ...DOCENTE_ROUTES,
    ...ESTUDIANTE_ROUTES,
    {
        path: 'dashboard',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'users',
                loadComponent: () => import('./features/users/users').then(m => m.Users)
            },
            {
                path: 'roles',
                loadComponent: () => import('./features/roles/roles').then(m => m.Roles)
            },
            {
                path: 'modules',
                loadComponent: () => import('./features/modules/modules').then(m => m.Modules)
            },
            {
                path: 'curso',
                loadComponent: () => import('./features/curso/curso').then(m => m.Curso)
            },
            {
                path: 'lecciones',
                loadChildren: () => import('./lecciones/lecciones.module').then(m => m.LeccionesModule)
            },
            {
                path: 'perfil',
                loadComponent: () => import('./perfil/perfil').then(m => m.Perfil)
            },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    }
];
