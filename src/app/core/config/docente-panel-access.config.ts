/**
 * Acceso al panel docente: capacidad de dominio + permisos (módulos), no solo el nombre del rol.
 *
 * 1. Perfil **docente** enlazado al usuario (`user.docente.id`) — quien está dado de alta como docente.
 * 2. Módulos RBAC en los roles — delegación sin cambiar el nombre del rol (p. ej. coordinación).
 * 3. Nombres de rol habituales — compatibilidad con datos antiguos sin fila `docente` cargada aún.
 */

export interface DocentePanelUserLike {
  id?: number;
  email?: string;
  docente?: { id?: number } | null;
  roles?: Array<{
    id?: number;
    name?: string;
    modules?: Array<{ name?: string }>;
  }>;
}

/** Módulos que conceden uso del panel aunque el usuario no tenga fila `docente` (opcional en BD). */
const DOCENTE_PANEL_ALLOWED_MODULE_NAMES_LOWER = [
  'paneldocente',
  'panel_docente',
  'docente panel',
  'panel de docente',
  'gestión docente',
  'gestion docente',
];

/**
 * Nombres de rol frecuentes — solo respaldo; el criterio principal es `user.docente` o módulos.
 */
const DOCENTE_PANEL_ALLOWED_ROLE_NAMES_LOWER = [
  'docente',
  'profesor',
  'teacher',
  'instructor',
];

function normalizeString(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function userHasDocenteProfile(
  user: DocentePanelUserLike | null | undefined,
): boolean {
  const id = user?.docente?.id;
  return typeof id === 'number' && id > 0;
}

function userHasDocentePanelModuleAccess(
  user: DocentePanelUserLike | null | undefined,
): boolean {
  if (!user?.roles?.length) return false;
  const moduleSet = new Set(DOCENTE_PANEL_ALLOWED_MODULE_NAMES_LOWER);
  for (const role of user.roles) {
    for (const module of role.modules ?? []) {
      const normalized = normalizeString(module.name);
      if (normalized && moduleSet.has(normalized)) {
        return true;
      }
    }
  }
  return false;
}

function userHasDocenteRoleNameFallback(
  user: DocentePanelUserLike | null | undefined,
): boolean {
  if (!user?.roles?.length) return false;
  const roleSet = new Set(DOCENTE_PANEL_ALLOWED_ROLE_NAMES_LOWER);
  for (const role of user.roles) {
    const normalized = normalizeString(role.name);
    if (normalized && roleSet.has(normalized)) {
      return true;
    }
  }
  return false;
}

/**
 * Puede usar rutas y UI del panel docente (coincide con quien debería tener datos en `/docente/*`).
 */
export function userHasDocentePanelAccess(
  user: DocentePanelUserLike | null | undefined,
): boolean {
  if (!user) return false;
  if (userHasDocenteProfile(user)) return true;
  if (userHasDocentePanelModuleAccess(user)) return true;
  return userHasDocenteRoleNameFallback(user);
}

export function userIsProtectedSystemDocente(
  user: DocentePanelUserLike | null | undefined,
): boolean {
  return userHasDocentePanelAccess(user);
}
