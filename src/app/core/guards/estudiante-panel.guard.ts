import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { userHasEstudiantePanelAccess } from '../config/estudiante-panel-access.config';
import { Auth } from '../services/auth';

export const estudiantePanelGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const allowUser = () => {
    const user = auth.currentUser();
    if (!userHasEstudiantePanelAccess(user) || !user?.isActive) {
      router.navigateByUrl('/auth/login');
      return false;
    }
    return true;
  };

  if (auth.isAuthenticated()) return allowUser();

  return auth.checkAuthStatus().pipe(
    take(1),
    map((loggedIn) => {
      if (!loggedIn) {
        router.navigateByUrl('/auth/login');
        return false;
      }
      return allowUser();
    }),
  );
};

