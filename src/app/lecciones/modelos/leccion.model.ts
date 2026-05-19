// src/app/lecciones/modelos/leccion.model.ts

export type EstadoLeccion = 'borrador' | 'publicado';

export interface Leccion {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string; // texto/HTML
  orden: number;
  estado: EstadoLeccion;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface CrearLeccionDto {
  titulo: string;
  descripcion: string;
  contenido: string;
  orden: number;
  estado: EstadoLeccion;
}

export interface ActualizarLeccionDto {
  titulo?: string;
  descripcion?: string;
  contenido?: string;
  orden?: number;
  estado?: EstadoLeccion;
}

export interface ProgresoLeccion {
  leccionId: string;
  usuarioId: number;
  completada: boolean;
  fechaCompletado?: Date;
}
