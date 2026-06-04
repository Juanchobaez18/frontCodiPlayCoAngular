/**
 * Acceso al panel del estudiante (`/estudiante/*`).
 * Criterio principal: perfil `user.estudiante` o rol/módulo de estudiante.
 */

export interface EstudiantePanelUserLike {
  estudiante?: { id?: number } | null;
  roles?: Array<{
    name?: string;
    modules?: Array<{ name?: string }>;
  }>;
}

const ESTUDIANTE_PANEL_ALLOWED_MODULE_NAMES_LOWER = [
  'panelusuario',
  'panel_usuario',
  'panel control usuario',
  'panel estudiante',
  'panel de estudiante',
];

const ESTUDIANTE_PANEL_ALLOWED_ROLE_NAMES_LOWER = [
  'estudiante',
  'student',
  'alumno',
];

function normalizeString(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function userHasEstudianteProfile(
  user: EstudiantePanelUserLike | null | undefined,
): boolean {
  const id = user?.estudiante?.id;
  return typeof id === 'number' && id > 0;
}

function userHasEstudiantePanelModuleAccess(
  user: EstudiantePanelUserLike | null | undefined,
): boolean {
  if (!user?.roles?.length) return false;
  const moduleSet = new Set(ESTUDIANTE_PANEL_ALLOWED_MODULE_NAMES_LOWER);
  for (const role of user.roles) {
    for (const module of role.modules ?? []) {
      const normalized = normalizeString(module.name);
      if (normalized && moduleSet.has(normalized)) return true;
    }
  }
  return false;
}

function userHasEstudianteRoleNameFallback(
  user: EstudiantePanelUserLike | null | undefined,
): boolean {
  if (!user?.roles?.length) return false;
  const roleSet = new Set(ESTUDIANTE_PANEL_ALLOWED_ROLE_NAMES_LOWER);
  for (const role of user.roles) {
    const normalized = normalizeString(role.name);
    if (normalized && roleSet.has(normalized)) return true;
  }
  return false;
}

export function userHasEstudiantePanelAccess(
  user: EstudiantePanelUserLike | null | undefined,
): boolean {
  if (!user) return false;
  if (userHasEstudianteProfile(user)) return true;
  if (userHasEstudiantePanelModuleAccess(user)) return true;
  return userHasEstudianteRoleNameFallback(user);
}
