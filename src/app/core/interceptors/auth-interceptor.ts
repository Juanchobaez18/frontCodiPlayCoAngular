import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Intentamos obtener el token del almacenamiento local
  const token = localStorage.getItem('token');

  // 2. Si hay un token, clonamos la petición original y le inyectamos el Header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache', // Opcional: Evita cachear respuestas protegidas
        'Pragma': 'no-cache'
      }
    });
    // 3. Enviamos la petición modificada
    return next(authReq);
  }

  // Si no hay token (ej. en el Login), dejamos pasar la petición original
  return next(req);
};
