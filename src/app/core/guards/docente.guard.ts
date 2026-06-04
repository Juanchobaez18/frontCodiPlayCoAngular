import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { Auth } from '../services/auth';
import { userHasDocentePanelAccess } from '../config/docente-panel-access.config';

export const docenteGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const allowUser = () => {
    const user = auth.currentUser();
    // Reuse the same access logic used in the login redirect and nav items
    if (userHasDocentePanelAccess(user) && user?.isActive) return true;
    router.navigateByUrl('/auth/login');
    return false;
  };

  // Fast path: signal already populated (normal in-session navigation)
  if (auth.isAuthenticated()) return allowUser();

  // Slow path: signal empty after F5 — validate token with the backend first
  return auth.checkAuthStatus().pipe(
    take(1),
    map(loggedIn => {
      if (!loggedIn) {
        router.navigateByUrl('/auth/login');
        return false;
      }
      return allowUser();
    }),
  );
};
