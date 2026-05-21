import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs';
import { userHasAdminPanelAccess } from '../config/admin-panel-access.config';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (userHasAdminPanelAccess(authService.currentUser())) {
      return true;
    }
    router.navigateByUrl('/auth/login');
    return false;
  }

  return authService.checkAuthStatus().pipe(
    take(1),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/auth/login');
        return false;
      }
      if (userHasAdminPanelAccess(authService.currentUser())) {
        return true;
      }
      router.navigateByUrl('/auth/login');
      return false;
    }),
  );
};
