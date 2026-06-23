import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'https://codiplayconest.onrender.com';

export interface CursoEstudiante {
  id: number;
  nombre: string;
  descripcion: string;
  dificultad?: string;
  precio?: number | string;
  estado?: boolean;
}

export interface MensajeEstudiante {
  id: number;
  contenido: string;
  fecha_envio: string;
  remitenteTipo: 'estudiante' | 'docente';
  estado?: string;
  docente?: { id: number; user?: { name?: string; lastName?: string } };
}

export interface TareaEntregaEstudiante {
  id: number;
  resultado: 'APROBADO' | 'NO_APROBADO' | null;
  estado: string;
  tarea: {
    id: number;
    titulo: string;
    leccion: { id: number; titulo: string; orden: number } | null;
    modulo: { id: number; titulo: string; orden: number } | null;
  } | null;
}

export interface EstudianteProfile {
  id: number;
  fechanacimiento?: string;
  edad?: number;
  fecharegistro?: string;
  progreso?: number;
  user: {
    id: number;
    name: string;
    lastName: string;
    email: string;
    docType?: string;
    docNumber?: string;
    avatar?: string;
  };
  cursos: CursoEstudiante[];
  foros: {
    id: number;
    titulo: string;
    descripcion: string;
    fecha_creacion: string;
    curso?: { id: number; nombre: string };
  }[];
  mensajes: MensajeEstudiante[];
  leccionesCompletadas?: { id: number }[];
  tareasEntregas?: TareaEntregaEstudiante[];
}

export interface ForoListItem {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  curso?: { id: number; nombre: string };
}

export interface LeccionBackend {
  id: number;
  titulo: string;
  descripcion: string;
  contenido: string;
  orden: string;
}

export interface ModuloBackend {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  lecciones: LeccionBackend[];
}

@Injectable({ providedIn: 'root' })
export class EstudianteApiService {
  private readonly http = inject(HttpClient);

  getProfileByUserId(userId: number) {
    return this.http.get<EstudianteProfile>(`${API_BASE}/estudiantes/by-user/${userId}`);
  }

  getForos() {
    return this.http.get<ForoListItem[]>(`${API_BASE}/foros`);
  }

  getForo(id: number) {
    return this.http.get<ForoListItem & { respuestas?: unknown[] }>(`${API_BASE}/foros/${id}`);
  }

  updateUser(userId: number, body: Record<string, unknown>) {
    return this.http.put(`${API_BASE}/users/${userId}`, body);
  }

  updateEstudiante(estudianteId: number, body: Record<string, unknown>) {
    return this.http.put(`${API_BASE}/estudiantes/${estudianteId}`, body);
  }

  uploadAvatar(userId: number, file: File) {
    const fd = new FormData();
    fd.append('avatar', file);
    return this.http.patch<{ avatar?: string }>(`${API_BASE}/users/${userId}/avatar`, fd);
  }

  enviarMensaje(body: {
    contenido: string;
    estudianteId: number;
    docenteId: number;
    remitenteTipo: 'estudiante';
  }) {
    return this.http.post(`${API_BASE}/mensajes`, body);
  }

  responderForo(foroId: number, body: { contenido: string; estudianteId: number }) {
    return this.http.post(`${API_BASE}/foros/${foroId}/respuestas`, body);
  }

  marcarLeccionCompletada(leccionId: number) {
    return this.http.post(`${API_BASE}/estudiantes/mis-lecciones/${leccionId}/completar`, {});
  }

  marcarTareaEntregada(moduloOrden: number, leccionOrden: number) {
    return this.http.post(`${API_BASE}/estudiantes/mis-tareas/entregar`, { moduloOrden, leccionOrden });
  }

  enviarSoporte(body: { name: string; email: string; message: string }) {
    return this.http.post(`${API_BASE}/contact`, body);
  }

  getModulosByCurso(cursoId: number) {
    return this.http.get<ModuloBackend[]>(`${API_BASE}/modulos/by-curso/${cursoId}`);
  }

  getModulo(id: number) {
    return this.http.get<ModuloBackend>(`${API_BASE}/modulos/${id}`);
  }

  getLeccion(id: number) {
    return this.http.get<LeccionBackend>(`${API_BASE}/lecciones/${id}`);
  }
}

