import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/components/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: AdminLayoutComponent, // El cascarón de Material
        canActivate: [authGuard],
        children: [
            // {
            //     path: 'dashboard',
            //     loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            // },
            {
                path: 'users',
                loadComponent: () => import('./users/users').then(m => m.Users)
            },
            {
                path: 'roles',
                loadComponent: () => import('./roles/roles').then(m => m.Roles)
            },
            {
                path: 'modules',
                loadComponent: () => import('./modules/modules').then(m => m.Modules)
            },
            {
                path: 'curso',
                loadComponent: () => import('./curso/curso').then(m => m.Curso)
            },
            {
                path: 'perfil',
                loadComponent: () => import('./perfil/perfil').then(m => m.Perfil)
            },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
