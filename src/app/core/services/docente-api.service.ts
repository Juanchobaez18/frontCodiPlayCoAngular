import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

export interface DocenteForo {
  id: number;
  titulo: string;
  descripcion: string;
  cursoId: number;
  cursoNombre?: string;
  fechaCreacion?: string;
  cantidadRespuestas?: number;
}

export interface DocenteMensaje {
  id: number;
  remitente: string;
  destinatario?: string;
  contenido?: string;
  asunto?: string;
  fecha: string;
  leido: boolean;
  tipo?: 'enviado' | 'recibido';
}

export interface DocenteEstudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class DocenteApiService {
  private readonly http = inject(HttpClient);

  getCursos() {
    return this.http.get<CursoDocente[]>(`${API_BASE}/curso`);
  }

  getForos(): Observable<DocenteForo[]> {
    return this.http.get<DocenteForo[]>(`${API_BASE}/docente/foros`).pipe(
      catchError(() => of([])),
    );
  }

  createForo(dto: { titulo: string; descripcion: string; cursoId: number }): Observable<DocenteForo> {
    return this.http.post<DocenteForo>(`${API_BASE}/docente/foros`, dto);
  }

  deleteForo(foroId: number): Observable<any> {
    return this.http.delete(`${API_BASE}/docente/foros/${foroId}`);
  }

  getEstudiantes(): Observable<DocenteEstudiante[]> {
    return this.http.get<DocenteEstudiante[]>(`${API_BASE}/docente/estudiantes`).pipe(
      catchError(() => of([])),
    );
  }

  getMensajesEnviados(): Observable<DocenteMensaje[]> {
    return this.http.get<DocenteMensaje[]>(`${API_BASE}/docente/mensajes?tipo=enviado`).pipe(
      catchError(() => of([])),
    );
  }

  getMensajesRecibidos(): Observable<DocenteMensaje[]> {
    return this.http.get<DocenteMensaje[]>(`${API_BASE}/docente/mensajes?tipo=recibido`).pipe(
      catchError(() => of([])),
    );
  }

  sendMensaje(dto: { destinatarioId: number; contenido: string }): Observable<any> {
    return this.http.post(`${API_BASE}/docente/mensajes`, dto);
  }

  uploadFotoPerfil(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post(`${API_BASE}/docente/subir-foto`, formData).pipe(
      catchError(() => of({ success: false })),
    );
  }
}
