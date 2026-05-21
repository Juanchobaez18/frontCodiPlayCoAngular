import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs';

const isDocente = (user: { roles?: { name?: string }[] } | null | undefined): boolean =>
  user?.roles?.some((r) => String(r.name ?? '').toLowerCase().includes('docente')) ?? false;

const isUserActive = (user: { isActive?: boolean } | null | undefined): boolean =>
  user?.isActive === true;

export const docenteGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.currentUser();
    if (isDocente(user) && isUserActive(user)) return true;
    router.navigateByUrl('/auth/login');
    return false;
  }

  return authService.checkAuthStatus().pipe(
    take(1),
    map((loggedIn) => {
      if (!loggedIn) {
        router.navigateByUrl('/auth/login');
        return false;
      }
      const user = authService.currentUser();
      if (isDocente(user) && isUserActive(user)) return true;
      router.navigateByUrl('/auth/login');
      return false;
    }),
  );
};
