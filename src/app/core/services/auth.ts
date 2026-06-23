import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginInterface } from '../../auth/interfaces/login';
import { Router } from '@angular/router';

export interface Module {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  modules: Module[];
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  docType: string;
  docNumber: string;
  email: string;
  isActive: boolean;
  avatar?: string;
  roles: Role[];
  docente?: { id: number } | null;
  estudiante?: { id: number } | null;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = 'https://codiplayconest.onrender.com/auth';

  private readonly _authStatus = signal<AuthResponse | null>(null);

  readonly currentUser = computed(() => this._authStatus()?.user);
  readonly isAuthenticated = computed(() => !!this._authStatus());
  readonly userModules = computed(() =>
    this._authStatus()?.user.roles.flatMap(r => r.modules.map(m => m.name)) ?? [],
  );

  login(credentials: LoginInterface): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => this.applyAuthResponse(res)),
    );
  }

  /**
   * Called after registration to populate the signal without a second HTTP round-trip.
   * Registration returns the same AuthResponse shape as login, so we can use it directly.
   */
  setAuthState(response: AuthResponse): void {
    this.applyAuthResponse(response);
  }

  /**
   * Validates the stored JWT and refreshes the in-memory signal.
   * Guards call this on page reload (F5) when the signal is empty but a token exists.
   */
  checkAuthStatus(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);

    return this.http.get<AuthResponse>(`${this.API_URL}/check-status`).pipe(
      tap(res => this.applyAuthResponse(res)),
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      }),
    );
  }

  logout(): void {
    localStorage.clear();
    this._authStatus.set(null);
    // Full reload clears any residual component state Angular might hold
    this.router.navigateByUrl('/auth').then(() => window.location.reload());
  }

  patchAvatar(url: string): void {
    const current = this._authStatus();
    if (current) {
      this._authStatus.set({ ...current, user: { ...current.user, avatar: url } });
    }
  }

  private applyAuthResponse(res: AuthResponse): void {
    localStorage.setItem('token', res.access_token);
    this._authStatus.set(res);
  }
}

