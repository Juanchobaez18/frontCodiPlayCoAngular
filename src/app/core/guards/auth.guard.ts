import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { Auth } from '../services/auth';
import { PendingCourseService } from '../services/pending-course.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const pendingCourse = inject(PendingCourseService);

  // Fast path: signal is already populated (normal in-session navigation)
  if (auth.isAuthenticated()) return true;

  // Slow path: signal is empty after a page reload (F5), but a token may exist.
  // checkAuthStatus() validates the token with the backend and repopulates the signal.
  return auth.checkAuthStatus().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) return true;

      // If the protected route is /registro-pago/:id, preserve the course id
      // so the login/register page can redirect here automatically after auth.
      const cursoId = route.paramMap.get('id');
      if (cursoId && !pendingCourse.peek()) {
        pendingCourse.save(Number(cursoId));
      }

      router.navigateByUrl('/auth/login');
      return false;
    }),
  );
};
