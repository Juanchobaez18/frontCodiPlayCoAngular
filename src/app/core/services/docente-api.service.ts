import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'http://localhost:3000';

export interface CursoDocente {
  id: number;
  nombre: string;
  descripcion: string;
  dificultad: string;
  precio: number;
  estado: boolean;
  docente?: {
    id: number;
    user?: { id: number; name: string; lastName: string; email: string };
  };
  estudiantes?: { id: number }[];
}

@Injectable({ providedIn: 'root' })
export class DocenteApiService {
  private readonly http = inject(HttpClient);

  getCursos() {
    return this.http.get<CursoDocente[]>(`${API_BASE}/curso`);
  }
}
