import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, take, switchMap, catchError, of, Observable } from 'rxjs';
import { userHasEstudiantePanelAccess } from '../config/estudiante-panel-access.config';
import { Auth } from '../services/auth';

const API_URL = 'http://localhost:3000/auth/perfil-estudiante';

export const estudiantePanelGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const http = inject(HttpClient);

  const checkEnrollment = (): Observable<boolean> => {
    const user = auth.currentUser();
    if (!userHasEstudiantePanelAccess(user) || !user?.isActive) {
      router.navigateByUrl('/auth/login');
      return of(false);
    }
    return http.get<{ cursos: unknown[] }>(API_URL).pipe(
      map((perfil) => {
        if (!perfil.cursos || perfil.cursos.length === 0) {
          router.navigate(['/cursos'], { queryParams: { requiere: 'inscripcion' } });
          return false;
        }
        return true;
      }),
      catchError(() => {
        router.navigate(['/cursos'], { queryParams: { requiere: 'inscripcion' } });
        return of(false);
      }),
    );
  };

  if (auth.isAuthenticated()) return checkEnrollment();

  return auth.checkAuthStatus().pipe(
    take(1),
    switchMap((loggedIn) => {
      if (!loggedIn) {
        router.navigateByUrl('/auth/login');
        return of(false);
      }
      return checkEnrollment();
    }),
  );
};
