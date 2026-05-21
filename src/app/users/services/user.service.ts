import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from '../../core/services/auth';

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
}

export interface Foro {
  id: number;
  titulo: string;
}

export interface EstudianteProfile {
  id: number;
  fechanacimiento: string;
  edad: number;
  fecharegistro: string;
  progreso: number;
  user: {
    id: number;
    name: string;
    lastName: string;
    email: string;
    avatar: string;
    isActive: boolean;
  };
  cursos: Curso[];
  foros: Foro[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(Auth);
  private api = 'http://localhost:3000';

  getEstudianteProfile(): Observable<EstudianteProfile> {
    const userId = this.authService.currentUser()?.id;
    return this.http.get<EstudianteProfile>(`${this.api}/estudiantes/by-user/${userId}`);
  }

  getProfile() {
    const userId = this.authService.currentUser()?.id;
    return this.http.get<any>(`${this.api}/users/${userId}`);
  }
}