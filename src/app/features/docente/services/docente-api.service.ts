import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_BASE = 'http://localhost:3000';

export interface DocenteDashboardStats {
  totalEstudiantes: number;
  totalCursosActivos: number;
  tasaCompletacion: number;
}

export interface DocenteCurso {
  id: number;
  nombre: string;
  descripcion: string;
  estudiantes: number;
  progreso: number;
  estado: boolean;
}

export interface CursoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  estudiantes: EstudianteProgreso[];
  modulos: ModuloDetalle[];
}

export interface EstudianteProgreso {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  progreso: number;
  estado: 'completado' | 'en_progreso' | 'iniciando';
  moduloActual?: string;
  leccionActual?: string;
  progresoModulo?: number;
}

export interface ModuloDetalle {
  id: number;
  nombre: string;
  orden: number;
  lecciones: LeccionDetalle[];
}

export interface LeccionDetalle {
  id: number;
  nombre: string;
  orden: number;
}

export interface DocenteEstudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cursos: string[];
  progreso: number;
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
  entregas?: TareaEntrega[];
}

export interface TareaEntrega {
  id: number;
  estudianteNombre: string;
  estudianteApellido?: string;
  estado: string;
  calificacion: string;
}

export interface DocenteMensaje {
  id: number;
  remitente: string;
  destinatario?: string;
  asunto: string;
  contenido?: string;
  fecha: string;
  leido: boolean;
  tipo?: 'enviado' | 'recibido';
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

export interface ForoRespuesta {
  id: number;
  mensaje: string;
  estudianteNombre: string;
  estudianteApellido?: string;
  fechaCreacion: string;
}

export interface CreateForoDto {
  titulo: string;
  descripcion: string;
  cursoId: number;
}

export interface UpdateForoDto {
  titulo?: string;
  descripcion?: string;
}

export interface SendMensajeDto {
  destinatarioId: number;
  contenido: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocenteApiService {
  private readonly http = inject(HttpClient);
  private readonly docenteUrl = `${API_BASE}/docente`;
  private readonly forosUrl = `${API_BASE}/foros`;
  private readonly mensajesUrl = `${API_BASE}/mensajes`;

  // ─── Dashboard ───
  getDashboardStats(): Observable<DocenteDashboardStats> {
    return this.http.get<DocenteDashboardStats>(`${this.docenteUrl}/dashboard/stats`);
  }

  // ─── Cursos ───
  getCursos(): Observable<DocenteCurso[]> {
    return this.http.get<DocenteCurso[]>(`${this.docenteUrl}/cursos`);
  }

  getCursoDetalle(cursoId: number): Observable<CursoDetalle> {
    return this.http.get<CursoDetalle>(`${this.docenteUrl}/cursos/${cursoId}`);
  }

  // ─── Estudiantes ───
  getEstudiantes(): Observable<DocenteEstudiante[]> {
    return this.http.get<DocenteEstudiante[]>(`${this.docenteUrl}/estudiantes`);
  }

  // ─── Tareas ───
  getTareas(): Observable<DocenteTarea[]> {
    return this.http.get<DocenteTarea[]>(`${this.docenteUrl}/tareas`);
  }

  calificarTarea(entregaId: number, resultado: string): Observable<any> {
    return this.http.post(`${this.docenteUrl}/tareas/calificar`, {
      entregaId,
      calificacion: resultado === 'APROBADO' ? 'Aprobado' : 'No aprobado',
      resultado,
    }).pipe(catchError(() => of({ success: false, message: 'Endpoint no disponible aún' })));
  }

  // ─── Mensajes ───
  getMensajes(): Observable<DocenteMensaje[]> {
    return this.http.get<DocenteMensaje[]>(`${this.docenteUrl}/mensajes`);
  }

  getMensajesEnviados(): Observable<DocenteMensaje[]> {
    return this.http.get<DocenteMensaje[]>(`${this.docenteUrl}/mensajes`).pipe(
      catchError(() => of([])),
    );
  }

  getMensajesRecibidos(): Observable<DocenteMensaje[]> {
    return this.http.get<DocenteMensaje[]>(`${this.docenteUrl}/mensajes`).pipe(
      catchError(() => of([])),
    );
  }

  sendMensaje(dto: SendMensajeDto): Observable<any> {
    return this.http.post(`${this.docenteUrl}/mensajes`, dto);
  }

  // ─── Foros ───
  getForos(): Observable<DocenteForo[]> {
    return this.http.get<DocenteForo[]>(`${this.docenteUrl}/foros`);
  }

  getForoById(foroId: number): Observable<DocenteForo> {
    return this.http.get<DocenteForo>(`${this.forosUrl}/${foroId}`);
  }

  createForo(dto: CreateForoDto): Observable<DocenteForo> {
    return this.http.post<DocenteForo>(this.forosUrl, dto);
  }

  updateForo(foroId: number, dto: UpdateForoDto): Observable<DocenteForo> {
    return this.http.put<DocenteForo>(`${this.forosUrl}/${foroId}`, dto);
  }

  deleteForo(foroId: number): Observable<any> {
    return this.http.delete(`${this.forosUrl}/${foroId}`);
  }

  getForoRespuestas(foroId: number): Observable<ForoRespuesta[]> {
    return this.http.get<ForoRespuesta[]>(`${this.forosUrl}/${foroId}/respuestas`);
  }

  // ─── Foto de perfil ───
  uploadFotoPerfil(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post(`${this.docenteUrl}/subir-foto`, formData).pipe(
      catchError(() => of({ success: false, message: 'Endpoint no disponible aún' })),
    );
  }
}
