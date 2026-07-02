/**
 * Configuración de insignias/logros del estudiante.
 * Patrón: objeto de configuración inmutable con criterios de desbloqueo.
 * Ventaja: fácil de mover a BD en el futuro (cada objeto mapea 1:1 a una fila).
 */

export interface BadgeConfig {
  /** Identificador único de la insignia */
  id: string;
  /** Nombre visible para el estudiante */
  nombre: string;
  /** Descripción motivacional (apropiada para niños) */
  descripcion: string;
  /** Icono emoji representativo */
  emoji: string;
  /** Color de acento de la tarjeta */
  color: string;
  /** Función que determina si la insignia está desbloqueada */
  condicion: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  /** Progreso global del estudiante (0–100) */
  progresoGlobal: number;
  /** Total de lecciones completadas */
  leccionesCompletadas: number;
  /** Total de lecciones disponibles */
  totalLecciones: number;
  /** Número de módulos con todas sus lecciones completadas */
  modulosCompletos: number;
  /** Total de módulos disponibles */
  totalModulos: number;
  /** ¿Ha completado al menos una lección? */
  primeraLeccion: boolean;
}

/**
 * Catálogo completo de insignias.
 * Ordenadas de menor a mayor dificultad para la vista del estudiante.
 */
export const BADGES_CONFIG: BadgeConfig[] = [
  {
    id: 'primera_leccion',
    nombre: '¡Primer Paso!',
    descripcion: 'Completaste tu primera lección. ¡El viaje comienza aquí!',
    emoji: '🚀',
    color: '#6366f1',
    condicion: (ctx) => ctx.primeraLeccion,
  },
  {
    id: 'cinco_lecciones',
    nombre: 'Explorador',
    descripcion: 'Completaste 5 lecciones. ¡Ya eres un explorador del código!',
    emoji: '🧭',
    color: '#06b6d4',
    condicion: (ctx) => ctx.leccionesCompletadas >= 5,
  },
  {
    id: 'progreso_25',
    nombre: 'Estrella Bronce',
    descripcion: 'Alcanzaste el 25% del curso. ¡Vas por buen camino!',
    emoji: '⭐',
    color: '#f59e0b',
    condicion: (ctx) => ctx.progresoGlobal >= 25,
  },
  {
    id: 'primer_modulo',
    nombre: 'Maestro del Módulo',
    descripcion: 'Completaste tu primer módulo completo. ¡Increíble!',
    emoji: '🏅',
    color: '#10b981',
    condicion: (ctx) => ctx.modulosCompletos >= 1,
  },
  {
    id: 'progreso_50',
    nombre: 'Estrella Plata',
    descripcion: '¡Llevas la mitad del camino! Eres una estrella.',
    emoji: '🌟',
    color: '#8b5cf6',
    condicion: (ctx) => ctx.progresoGlobal >= 50,
  },
  {
    id: 'diez_lecciones',
    nombre: 'Programador Junior',
    descripcion: 'Completaste 10 lecciones. ¡Ya piensas como programador!',
    emoji: '💻',
    color: '#3b82f6',
    condicion: (ctx) => ctx.leccionesCompletadas >= 10,
  },
  {
    id: 'progreso_75',
    nombre: 'Estrella Oro',
    descripcion: '¡Casi lo logras! El 75% completado. ¡Tú puedes!',
    emoji: '🏆',
    color: '#f97316',
    condicion: (ctx) => ctx.progresoGlobal >= 75,
  },
  {
    id: 'todos_modulos',
    nombre: 'Gran Maestro',
    descripcion: 'Completaste todos los módulos del curso. ¡Extraordinario!',
    emoji: '👑',
    color: '#ec4899',
    condicion: (ctx) =>
      ctx.totalModulos > 0 && ctx.modulosCompletos === ctx.totalModulos,
  },
  {
    id: 'progreso_100',
    nombre: '¡Campeón CodiPlay!',
    descripcion: '¡Completaste el 100% del curso! Eres un verdadero campeón del código.',
    emoji: '🎓',
    color: '#facc15',
    condicion: (ctx) => ctx.progresoGlobal >= 100,
  },
];

/**
 * Calcula las insignias desbloqueadas a partir del contexto del estudiante.
 */
export function calcularInsignias(ctx: BadgeContext): BadgeConfig[] {
  return BADGES_CONFIG.filter((badge) => badge.condicion(ctx));
}

/**
 * Retorna todas las insignias con un indicador de si están desbloqueadas.
 */
export function todasLasInsigniasConEstado(
  ctx: BadgeContext,
): (BadgeConfig & { desbloqueada: boolean })[] {
  return BADGES_CONFIG.map((badge) => ({
    ...badge,
    desbloqueada: badge.condicion(ctx),
  }));
}
