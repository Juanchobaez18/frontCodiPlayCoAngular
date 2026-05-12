import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/components/admin-layout/admin-layout.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
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
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
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
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
