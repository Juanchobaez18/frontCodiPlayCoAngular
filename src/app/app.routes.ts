import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/components/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'landing-page',
        loadChildren: () => import('./features/landing-page/landing-page.routes').then(m => m.LANDING_PAGE_ROUTES)
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
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        redirectTo: 'landing-page',
        pathMatch: 'full'
    }
];
