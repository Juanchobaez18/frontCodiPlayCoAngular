// src/app/lecciones/guards/estudiante.guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { map, tap } from 'rxjs';

export const estudianteGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // 1. Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  // 2. Verificar si tiene rol de estudiante o admin
  const user = authService.currentUser();
  if (!user) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  const tieneRolValido = user.roles.some(rol => 
    rol.name.toLowerCase() === 'estudiante' || 
    rol.name.toLowerCase() === 'admin' ||
    rol.name.toLowerCase() === 'administrador'
  );

  if (!tieneRolValido) {
    // Si no tiene rol válido, redirigir a home o página de acceso denegado
    router.navigate(['/']);
    return false;
  }

  return true;
};
