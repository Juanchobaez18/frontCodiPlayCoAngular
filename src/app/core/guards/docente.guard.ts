import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs';
import { userHasDocentePanelAccess } from '../config/docente-panel-access.config';

export const docenteGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (userHasDocentePanelAccess(authService.currentUser())) {
      return true;
    }
    router.navigateByUrl('/users');
    return false;
  }

  return authService.checkAuthStatus().pipe(
    take(1),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/auth/login');
        return false;
      }
      if (userHasDocentePanelAccess(authService.currentUser())) {
        return true;
      }
      router.navigateByUrl('/users');
      return false;
    }),
  );
};
