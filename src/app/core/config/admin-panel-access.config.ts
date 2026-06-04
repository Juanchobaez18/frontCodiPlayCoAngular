/**
 * Debe coincidir con `src/auth/config/admin-panel-access.config.ts` en Nest.
 *
 * Roles del proyecto: **Administrador**, **Docente**, **Estudiante**.
 * Solo **Administrador** accede al panel por nombre de rol (o por módulo en la lista).
 */
export const ADMIN_PANEL_ALLOWED_ROLE_NAMES_LOWER = [
  'administrador',
  'administrador sena',
  'admin',
] as const;

export const ADMIN_PANEL_ALLOWED_MODULE_NAMES_LOWER = [
  'paneladmin',
  'panel_admin',
  'admin panel',
  'panel administrativo',
  'gestión administrativa',
  'gestion administrativa',
  'panel de administración',
] as const;

export const PROTECTED_SYSTEM_ADMIN_ROLE_NAMES_LOWER = [
  'administrador',
  'administrador sena',
  'admin',
] as const;

function normalizeKey(s: string): string {
  return String(s ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

const ROLE_SET = new Set(
  ADMIN_PANEL_ALLOWED_ROLE_NAMES_LOWER.map((n) => normalizeKey(n)),
);
const MODULE_SET = new Set(
  ADMIN_PANEL_ALLOWED_MODULE_NAMES_LOWER.map((n) => normalizeKey(n)),
);
const PROTECTED_ROLE_SET = new Set(
  PROTECTED_SYSTEM_ADMIN_ROLE_NAMES_LOWER.map((n) => normalizeKey(n)),
);

export type AdminPanelUserLike = {
  roles?: Array<{ name?: string; modules?: Array<{ name?: string }> }>;
};

export function userHasAdminPanelAccess(user: AdminPanelUserLike | null | undefined): boolean {
  if (!user?.roles?.length) return false;
  for (const role of user.roles) {
    const rn = normalizeKey(String(role.name ?? ''));
    if (rn && ROLE_SET.has(rn)) return true;
    for (const m of role.modules ?? []) {
      const mn = normalizeKey(String(m.name ?? ''));
      if (mn && MODULE_SET.has(mn)) return true;
      const slug = mn.replace(/\s+/g, '');
      for (const allowed of MODULE_SET) {
        if (slug && slug === allowed.replace(/\s+/g, '')) return true;
      }
    }
  }
  return false;
}

export function userIsProtectedSystemAdmin(
  user: AdminPanelUserLike | null | undefined,
): boolean {
  if (!user?.roles?.length) return false;
  return user.roles.some((r) =>
    PROTECTED_ROLE_SET.has(normalizeKey(String(r.name ?? ''))),
  );
}
