// src/app/lecciones/modelos/leccion.model.ts

export type EstadoLeccion = 'borrador' | 'publicado';

export interface Leccion {
  id: number;
  titulo: string;
  descripcion: string;
  contenido: string; // texto/HTML
  orden: string;
  estado: EstadoLeccion;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface CrearLeccionDto {
  // Título debe tener mínimo 3 caracteres
  titulo: string;
  // Descripción debe tener mínimo 10 caracteres
  descripcion: string;
  // Contenido debe tener mínimo 20 caracteres
  contenido: string;
  orden: string;
  estado: EstadoLeccion;
  moduloId: number;
}

export interface ActualizarLeccionDto {
  titulo?: string;
  descripcion?: string;
  contenido?: string;
  orden?: string;
  estado?: EstadoLeccion;
}

export interface ProgresoLeccion {
  id: number;
  leccionId: number;
  usuarioId: number;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  fecha_inicio?: Date;
  fecha_completado?: Date;
  tiempo_total_minutos?: number;
  notas?: string;
}

export interface DeleteResponse {
  message: string;
  id: number;
}
