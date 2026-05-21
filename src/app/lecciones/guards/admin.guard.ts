// src/app/lecciones/guards/admin.guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { map, tap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // 1. Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  // 2. Verificar si tiene rol de admin
  const user = authService.currentUser();
  if (!user) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  const tieneRolAdmin = user.roles.some(rol => 
    rol.name.toLowerCase() === 'admin' || 
    rol.name.toLowerCase() === 'administrador'
  );

  if (!tieneRolAdmin) {
    // Si no es admin, redirigir a página de lecciones de estudiante
    router.navigate(['/lecciones']);
    return false;
  }

  return true;
};
