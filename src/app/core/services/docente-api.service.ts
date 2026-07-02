import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiUrl;

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
  progreso?: number;
}

export interface EstudianteCursoDetalle {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  progreso: number;
  estado: string;
  moduloActual?: string | null;
  leccionActual?: string | null;
  progresoModulo?: number;
}

export interface CursoDetalleDocente {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  estudiantes: EstudianteCursoDetalle[];
  modulos: { id: number; nombre: string; orden: number; lecciones: { id: number; nombre: string; orden: number }[] }[];
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
  cursos: string[];
  progreso: number;
}

export interface LeccionProgresoDetalle {
  id: number;
  titulo: string;
  orden: number;
  completada: boolean;
}

export interface ModuloProgresoDetalle {
  moduloId: number;
  moduloTitulo: string;
  orden: number;
  cursoNombre: string;
  totalLecciones: number;
  leccionesCompletadas: number;
  porcentaje: number;
  lecciones: LeccionProgresoDetalle[];
}

export interface EntregaProgresoDetalle {
  id: number;
  estado: string;
  resultado: 'APROBADO' | 'NO_APROBADO' | null;
  calificacion: string | null;
  tarea: {
    id: number;
    titulo: string;
    leccion: { id: number; titulo: string } | null;
    modulo: { id: number; titulo: string } | null;
  } | null;
}

export interface EstudianteProgresoDetalle {
  estudianteId: number;
  nombre: string;
  apellido: string;
  email: string;
  progresoGlobal: number;
  totalLeccionesCompletadas: number;
  totalLecciones: number;
  progresoModulos: ModuloProgresoDetalle[];
  tareasEntregas: EntregaProgresoDetalle[];
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
    return this.http.get<CursoDocente[]>(`${API_BASE}/docente/cursos`);
  }

  getDashboardStats(): Observable<{ totalEstudiantes: number; totalCursosActivos: number; tasaCompletacion: number }> {
    return this.http.get<{ totalEstudiantes: number; totalCursosActivos: number; tasaCompletacion: number }>(`${API_BASE}/docente/dashboard/stats`);
  }

  getCursoDetalle(cursoId: number): Observable<CursoDetalleDocente> {
    return this.http.get<CursoDetalleDocente>(`${API_BASE}/docente/cursos/${cursoId}`);
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

  updateForo(foroId: number, dto: { titulo: string; descripcion: string }): Observable<DocenteForo> {
    return this.http.put<DocenteForo>(`${API_BASE}/docente/foros/${foroId}`, dto);
  }

  getMensajesRecibidosCount(): Observable<number> {
    return this.getMensajesRecibidos().pipe(
      map((msgs: DocenteMensaje[]) => msgs.filter((m: DocenteMensaje) => !m.leido).length),
      catchError(() => of(0)),
    );
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

  getEstudianteProgreso(estudianteId: number): Observable<EstudianteProgresoDetalle> {
    return this.http.get<EstudianteProgresoDetalle>(
      `${API_BASE}/docente/estudiantes/${estudianteId}/progreso`,
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

  marcarMensajeLeido(id: number): Observable<any> {
    return this.http.patch(`${API_BASE}/mensajes/${id}/leido`, {});
  }

  uploadFotoPerfil(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post(`${API_BASE}/docente/subir-foto`, formData).pipe(
      catchError(() => of({ success: false })),
    );
  }
}

