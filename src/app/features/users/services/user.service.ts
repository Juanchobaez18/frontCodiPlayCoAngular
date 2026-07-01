import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/services/auth';

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
    avatar?: string;
  };
  cursos: { id: number; nombre: string; descripcion: string; estado: boolean }[];
  foros: { id: number; titulo: string; descripcion: string; fecha_creacion: string }[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);

  getEstudianteProfile() {
    const userId = this.auth.currentUser()?.id;
    return this.http.get<EstudianteProfile>(`https://codiplayconest.onrender.com/estudiantes/by-user/${userId}`);
  }
}

