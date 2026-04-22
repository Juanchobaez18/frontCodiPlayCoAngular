import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginInterface } from '../../auth/interfaces/login';
import { Router } from '@angular/router';
// import { LoginInterface } from '../interfaces/login';

// export interface AuthResponse {
//   accessToken: string;
//   user: {
//     id: number;
//     email: string;
//     role: string; // Importante por tu RBAC
//   };
// }

export interface Module {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  modules: Module[]; // Los módulos a los que este rol da acceso
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  docType: string;
  docNumber: string;
  email: string;
  isActive: boolean;
  roles: Role[]; // Nota que es un array según tu JSON
}

export interface AuthResponse {
  access_token: string; // Coincide con el snake_case de tu backend
  user: User;
}


@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:3000/auth';

  // 1. Estado privado (Signal) - Almacena el objeto completo del back
  private _authStatus = signal<AuthResponse | null>(null);

  // 2. Selectores públicos (Computed) - Reaccionan automáticamente
  public currentUser = computed(() => this._authStatus()?.user);
  public isAuthenticated = computed(() => !!this._authStatus());

  // Selector para obtener los permisos (módulos) de forma aplanada
  public userModules = computed(() => {
    const user = this._authStatus()?.user;
    return user ? user.roles.flatMap(r => r.modules.map(m => m.name)) : [];
  });

  /** Método principal de Login */
  public login(credentials: LoginInterface): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        // Persistencia básica para recargas de página
        localStorage.setItem('token', response.access_token);
        // Guardamos en la Signal el objeto que contiene access_token y user
        this._authStatus.set(response);
      })
    );
  }

  public logout(): void {
    localStorage.clear()
    this._authStatus.set(null);
    this.router.navigateByUrl('/auth').then(() => {
      // Opcional: Aquí podrías mostrar un mensaje de "Has cerrado sesión
      window.location.reload(); // Forzamos recarga para limpiar cualquier estado residual"
    });
    // localStorage.removeItem('token');
  }

  public checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token'); // Asegúrate que la llave sea exactamente 'token'
    if (!token) return of(false);

    // Inyectamos el header manualmente aquí
    return this.http.get<AuthResponse>(`${this.API_URL}/check-status`).pipe(
      tap((response) => {
        this._authStatus.set(response);
        localStorage.setItem('token', response.access_token);
      }),
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  // public checkAuthStatus(): Observable<boolean> {
  //   const token = localStorage.getItem('token');
  //   if (!token) return of(false);

  //   return this.http.get<AuthResponse>(`${this.API_URL}/check-status`).pipe(
  //     tap((response) => {
  //       this._authStatus.set(response);
  //       localStorage.setItem('token', response.access_token);
  //     }),
  //     map(() => true),
  //     catchError(() => {
  //       this.logout();
  //       return of(false);
  //     })
  //   );
  // }

  // public login(user: LoginInterface){
  //   this.http.post<LoginInterface>(`http://localhost:3000/users`, user).subscribe(data => {
  //     // ... Aqui es donde pienso darle un valor al signal que vamos a configurar
  //   });
  // }
}
