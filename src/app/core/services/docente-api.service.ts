import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_BASE = 'https://codiplayconest.onrender.com';

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

export interface TareaEntrega {
  id: number;
  estudianteNombre: string;
  estudianteApellido?: string;
  estado: string;
  calificacion: string | null;
  resultado: 'APROBADO' | 'NO_APROBADO' | null;
}

export interface DocenteTarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaVencimiento: string;
  fechaCreacion?: string;
  estudiantes: number;
  estado: string;
  modulo?: string;
  leccion?: string;
  cursoId?: number;
  cursoNombre?: string;
  entregas?: TareaEntrega[];
}

export interface ForoRespuesta {
  id: number;
  mensaje: string;
  estudianteNombre: string;
  estudianteApellido?: string;
  esDocente?: boolean;
  docenteId?: number;
  estudianteId?: number;
  fechaCreacion: string;
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

  getForoById(foroId: number): Observable<DocenteForo> {
    return this.http.get<DocenteForo>(`${API_BASE}/docente/foros/${foroId}`);
  }

  createForo(dto: { titulo: string; descripcion: string; cursoId: number }): Observable<DocenteForo> {
    return this.http.post<DocenteForo>(`${API_BASE}/docente/foros`, dto);
  }

  deleteForo(foroId: number): Observable<any> {
    return this.http.delete(`${API_BASE}/docente/foros/${foroId}`);
  }

  getForoRespuestas(foroId: number): Observable<ForoRespuesta[]> {
    return this.http.get<ForoRespuesta[]>(`${API_BASE}/docente/foros/${foroId}/respuestas`);
  }

  responderForo(foroId: number, dto: { contenido: string; docenteId: number }): Observable<any> {
    return this.http.post(`${API_BASE}/foros/${foroId}/respuestas`, dto);
  }

  updateForoRespuesta(respuestaId: number, dto: { contenido: string }): Observable<any> {
    return this.http.put(`${API_BASE}/foros/respuestas/${respuestaId}`, dto);
  }

  deleteForoRespuesta(respuestaId: number): Observable<any> {
    return this.http.delete(`${API_BASE}/foros/respuestas/${respuestaId}`);
  }

  getEstudiantes(): Observable<DocenteEstudiante[]> {
    return this.http.get<DocenteEstudiante[]>(`${API_BASE}/docente/estudiantes`).pipe(
      catchError(() => of([])),
    );
  }

  getTareas(): Observable<DocenteTarea[]> {
    return this.http.get<DocenteTarea[]>(`${API_BASE}/docente/tareas`);
  }

  calificarTarea(entregaId: number, resultado: 'APROBADO' | 'NO_APROBADO'): Observable<any> {
    return this.http.post(`${API_BASE}/docente/tareas/calificar`, {
      entregaId,
      calificacion: resultado === 'APROBADO' ? 'Aprobado' : 'No aprobado',
      resultado,
    });
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

