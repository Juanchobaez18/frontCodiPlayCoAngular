import { Component, Injectable, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { Auth } from '../../services/auth';
import {
  userHasAdminPanelAccess,
  userIsProtectedSystemAdmin,
} from '../../config/admin-panel-access.config';

const API_BASE = 'http://localhost:3000';

export interface DashboardStats {
  totalEstudiantes: number;
  totalCursosActivos: number;
  totalDocentesActivos: number;
}

export interface ManagedUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
  docType?: string;
  docNumber?: string;
  roles: { id: number; name: string }[];
}

export interface AdminRoleOption {
  id: number;
  name: string;
}

export interface StudentEmailRow {
  id: number;
  email: string;
  name: string;
  lastName: string;
}

export interface CursoRow {
  id: number;
  nombre: string;
  descripcion: string;
  dificultad: string;
  precio: number;
  estado: boolean;
  docente?: { id: number; user?: { name: string; lastName: string } };
}

export interface DocenteRow {
  id: number;
  ultimoAcceso: string;
  pagos: number;
  user: { id: number; name: string; lastName: string; email: string };
}

export interface RegisterDocentePayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
  docType: string;
  docNumber: string;
  avatar?: string;
}

export interface CursoPayload {
  nombre: string;
  descripcion: string;
  dificultad: string;
  precio: number;
  estado?: boolean;
  docenteId: number;
  estudiantesIds?: number[];
}

export type AdminPanelView =
  | 'dashboard'
  | 'usuarios'
  | 'docentes'
  | 'cursos'
  | 'curso-create'
  | 'curso-edit'
  | 'mensajes'
  | null;

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly adminUrl = `${API_BASE}/admin`;

  getDashboardStats() {
    return this.http.get<DashboardStats>(`${this.adminUrl}/dashboard/stats`);
  }

  getManagedUsers() {
    return this.http.get<ManagedUser[]>(`${this.adminUrl}/users/managed`);
  }

  deleteUser(id: number) {
    return this.http.delete<{ ok: boolean }>(`${this.adminUrl}/users/${id}`);
  }

  updateManagedUser(id: number, body: Record<string, unknown>) {
    return this.http.put<ManagedUser>(`${this.adminUrl}/users/${id}`, body);
  }

  toggleUserActive(id: number) {
    return this.http.patch<ManagedUser>(`${this.adminUrl}/users/${id}/toggle-active`, {});
  }

  getRolesForForms() {
    return this.http.get<AdminRoleOption[]>(`${this.adminUrl}/form/roles`);
  }

  getStudentEmails() {
    return this.http.get<StudentEmailRow[]>(`${this.adminUrl}/students/emails`);
  }

  sendBulkMail(emails: string[], message: string, subject?: string) {
    return this.http.post<{ ok: boolean; sent: number }>(`${this.adminUrl}/messages/bulk`, {
      emails,
      message,
      subject,
    });
  }

  registerDocente(payload: RegisterDocentePayload) {
    return this.http.post<{ ok: boolean }>(`${this.adminUrl}/docentes`, payload);
  }

  getDocentes() {
    return this.http.get<DocenteRow[]>(`${this.adminUrl}/docentes`);
  }

  getCursos() {
    return this.http.get<CursoRow[]>(`${this.adminUrl}/cursos`);
  }

  getCurso(id: number) {
    return this.http.get<
      CursoRow & { docente?: { id: number }; estudiantes?: { id: number }[] }
    >(`${this.adminUrl}/cursos/${id}`);
  }

  createCurso(payload: CursoPayload) {
    return this.http.post<CursoRow>(`${this.adminUrl}/cursos`, {
      ...payload,
      estudiantesIds: payload.estudiantesIds ?? [],
    });
  }

  updateCurso(id: number, payload: Partial<CursoPayload>) {
    return this.http.put<CursoRow>(`${this.adminUrl}/cursos/${id}`, payload);
  }

  deleteCurso(id: number) {
    return this.http.delete(`${this.adminUrl}/cursos/${id}`);
  }

  toggleCurso(id: number) {
    return this.http.patch<CursoRow>(`${this.adminUrl}/cursos/${id}/toggle-active`, {});
  }
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    CommonModule,
    FormsModule,
    NgTemplateOutlet,
  ],
})
export class AdminLayoutComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);

  public authService = inject(Auth);
  public menuItems = this.authService.userModules;

  readonly isAdminShell = signal(this.router.url.split('?')[0].startsWith('/admin'));
  readonly adminPanelView = signal<AdminPanelView>(null);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  /** Shell CodiPlayCo (ex admin-codiplay-shell) */
  isMenuOpen = false;
  isLightTheme = false;

  private lastAdminDataKey = '';

  /** Dashboard */
  dashboardStats: DashboardStats | null = null;
  dashboardLoading = true;
  dashboardError: string | null = null;

  /** Usuarios */
  users: ManagedUser[] = [];
  usersLoading = true;
  usersError: string | null = null;

  rolesCatalog: AdminRoleOption[] = [];
  rolesCatalogLoaded = false;
  userEditModalOpen = false;
  userEditSaving = false;
  userEditError: string | null = null;
  userEditForm = {
    id: 0,
    name: '',
    lastName: '',
    email: '',
    docType: 'CC',
    docNumber: '',
    isActive: true,
    roleIds: [] as number[],
    password: '',
  };

  /** Docentes registro */
  docenteRegModel = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    docType: 'CC',
    docNumber: '',
  };
  docenteSending = false;
  docenteMessage: string | null = null;
  docenteError: string | null = null;

  /** Cursos listado */
  cursos: CursoRow[] = [];
  cursosLoading = true;
  cursosError: string | null = null;

  /** Curso form */
  cursoFormMode: 'create' | 'edit' = 'create';
  cursoFormId: number | null = null;
  cursoDocentes: DocenteRow[] = [];
  cursoDirigido = '';
  cursoModel: CursoPayload = {
    nombre: '',
    descripcion: '',
    dificultad: 'Baja',
    precio: 0,
    estado: true,
    docenteId: 0,
    estudiantesIds: [],
  };
  cursoFormLoading = true;
  cursoFormSaving = false;
  cursoFormError: string | null = null;

  /** Mensajes masivos */
  msgStudents: StudentEmailRow[] = [];
  msgSelected = new Set<string>();
  msgBody = '';
  msgLoading = true;
  msgSending = false;
  msgInfo: string | null = null;
  msgError: string | null = null;

  constructor() {
    this.applyAdminRoute(this.router.url);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        const path = e.urlAfterRedirects.split('?')[0];
        this.isAdminShell.set(path.startsWith('/admin'));
        this.applyAdminRoute(e.urlAfterRedirects);
        if (path.startsWith('/admin')) {
          this.isMenuOpen = false;
        }
      });
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isLightTheme = true;
      document.body.classList.add('light-theme');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  isAppAdmin(): boolean {
    return userHasAdminPanelAccess(this.authService.currentUser());
  }

  navActive(tab: 'dash' | 'users' | 'teach' | 'courses' | 'msg'): boolean {
    const url = this.router.url.split('?')[0];
    switch (tab) {
      case 'dash':
        return url === '/admin' || url === '/admin/' || url.endsWith('/admin/dashboard');
      case 'users':
        return url.includes('/admin/usuarios');
      case 'teach':
        return url.includes('/admin/docentes');
      case 'courses':
        return url.includes('/admin/cursos');
      case 'msg':
        return url.includes('/admin/mensajes');
      default:
        return false;
    }
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleTheme(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isLightTheme = input.checked;
    if (this.isLightTheme) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }

  private parseAdminPath(path: string): AdminPanelView {
    if (path.endsWith('/admin/dashboard') || path === '/admin' || path === '/admin/') {
      return 'dashboard';
    }
    if (path.includes('/admin/usuarios')) return 'usuarios';
    if (path.includes('/admin/docentes')) return 'docentes';
    if (path.includes('/admin/mensajes')) return 'mensajes';
    if (path.endsWith('/admin/cursos/nuevo') || path.includes('/admin/cursos/nuevo')) {
      return 'curso-create';
    }
    if (/\/admin\/cursos\/\d+\/editar/.test(path)) return 'curso-edit';
    if (path.includes('/admin/cursos')) return 'cursos';
    return 'dashboard';
  }

  private applyAdminRoute(fullUrl: string): void {
    const path = fullUrl.split('?')[0];
    if (!path.startsWith('/admin')) {
      this.adminPanelView.set(null);
      this.lastAdminDataKey = '';
      return;
    }
    const view = this.parseAdminPath(path);
    this.adminPanelView.set(view);
    const dataKey = `${view}:${path}`;
    if (dataKey === this.lastAdminDataKey) return;
    this.lastAdminDataKey = dataKey;

    switch (view) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'usuarios':
        this.loadUsers();
        break;
      case 'docentes':
        break;
      case 'cursos':
        this.loadCursos();
        break;
      case 'curso-create':
        this.initCursoForm('create', null);
        break;
      case 'curso-edit': {
        const m = path.match(/\/admin\/cursos\/(\d+)\/editar/);
        const id = m ? Number(m[1]) : null;
        this.initCursoForm('edit', id);
        break;
      }
      case 'mensajes':
        this.loadMensajes();
        break;
      default:
        break;
    }
  }

  private loadDashboard(): void {
    this.dashboardLoading = true;
    this.dashboardError = null;
    this.adminApi.getDashboardStats().subscribe({
      next: (s) => {
        this.dashboardStats = s;
        this.dashboardLoading = false;
      },
      error: () => {
        this.dashboardError = 'No se pudieron cargar las métricas.';
        this.dashboardLoading = false;
      },
    });
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.usersError = null;
    this.adminApi.getManagedUsers().subscribe({
      next: (rows) => {
        this.users = rows;
        this.usersLoading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.usersError = err?.error?.message ?? 'No se pudieron cargar los usuarios.';
        this.usersLoading = false;
      },
    });
  }

  deleteUser(u: ManagedUser): void {
    if (this.isAdminPanelUser(u)) {
      alert('No se puede eliminar un usuario administrador desde este panel.');
      return;
    }
    if (!confirm(`¿Eliminar a ${u.name} ${u.lastName}?`)) return;
    this.adminApi.deleteUser(u.id).subscribe({
      next: () => this.loadUsers(),
      error: (err: { error?: { message?: string } }) => {
        alert(err?.error?.message ?? 'No se pudo eliminar.');
      },
    });
  }

  rolesLabel(u: ManagedUser): string {
    return u.roles?.map((r) => r.name).join(', ') ?? '';
  }

  isDocente(u: ManagedUser): boolean {
    return u.roles?.some((r) => String(r.name).toUpperCase() === 'DOCENTE') ?? false;
  }

  isEstudiante(u: ManagedUser): boolean {
    return (
      u.roles?.some(
        (r) =>
          String(r.name).toUpperCase() === 'USUARIO' ||
          String(r.name).toUpperCase() === 'ESTUDIANTE' ||
          r.id === 3,
      ) ?? false
    );
  }

  isAdminPanelUser(u: ManagedUser): boolean {
    return userIsProtectedSystemAdmin(u);
  }

  private ensureRolesCatalog(done?: () => void): void {
    if (this.rolesCatalogLoaded) {
      done?.();
      return;
    }
    this.adminApi.getRolesForForms().subscribe({
      next: (rows) => {
        this.rolesCatalog = rows;
        this.rolesCatalogLoaded = true;
        done?.();
      },
      error: () => {
        alert('No se pudieron cargar los roles para el formulario.');
      },
    });
  }

  openUserEdit(u: ManagedUser): void {
    if (this.isAdminPanelUser(u)) {
      alert('No se puede editar un usuario administrador desde este panel.');
      return;
    }
    this.userEditError = null;
    this.ensureRolesCatalog(() => {
      this.userEditForm = {
        id: u.id,
        name: u.name,
        lastName: u.lastName,
        email: u.email,
        docType: u.docType ?? 'CC',
        docNumber: u.docNumber ?? '',
        isActive: u.isActive,
        roleIds: u.roles?.map((r) => r.id) ?? [],
        password: '',
      };
      this.userEditModalOpen = true;
    });
  }

  closeUserEdit(): void {
    this.userEditModalOpen = false;
    this.userEditError = null;
    this.userEditSaving = false;
  }

  userEditHasRole(roleId: number): boolean {
    return this.userEditForm.roleIds.includes(roleId);
  }

  toggleUserEditRole(roleId: number, checked: boolean): void {
    if (checked) {
      if (!this.userEditForm.roleIds.includes(roleId)) {
        this.userEditForm.roleIds = [...this.userEditForm.roleIds, roleId];
      }
    } else {
      this.userEditForm.roleIds = this.userEditForm.roleIds.filter((id) => id !== roleId);
    }
  }

  saveUserEdit(): void {
    if (!this.userEditForm.roleIds.length) {
      this.userEditError = 'Selecciona al menos un rol.';
      return;
    }
    const pwd = this.userEditForm.password.trim();
    if (pwd.length > 0 && pwd.length < 6) {
      this.userEditError = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.userEditSaving = true;
    this.userEditError = null;
    const body: Record<string, unknown> = {
      name: this.userEditForm.name,
      lastName: this.userEditForm.lastName,
      email: this.userEditForm.email,
      docType: this.userEditForm.docType,
      docNumber: this.userEditForm.docNumber,
      isActive: this.userEditForm.isActive,
      roleIds: [...this.userEditForm.roleIds],
    };
    if (pwd.length > 0) {
      body['password'] = pwd;
    }
    this.adminApi.updateManagedUser(this.userEditForm.id, body).subscribe({
      next: () => {
        this.userEditSaving = false;
        this.closeUserEdit();
        this.loadUsers();
      },
      error: (err: { error?: { message?: string | string[] } }) => {
        this.userEditSaving = false;
        const m = err?.error?.message;
        this.userEditError =
          (typeof m === 'string' ? m : Array.isArray(m) ? m.join(', ') : null) ??
          'No se pudo guardar.';
      },
    });
  }

  toggleUserActiveStatus(u: ManagedUser): void {
    if (this.isAdminPanelUser(u)) {
      alert('No se puede cambiar el estado de un usuario administrador desde este panel.');
      return;
    }
    const msg = u.isActive
      ? `¿Desactivar a ${u.name} ${u.lastName}? No podrá iniciar sesión hasta que lo reactives.`
      : `¿Activar a ${u.name} ${u.lastName}?`;
    if (!confirm(msg)) return;
    this.adminApi.toggleUserActive(u.id).subscribe({
      next: () => this.loadUsers(),
      error: (err: { error?: { message?: string } }) => {
        alert(err?.error?.message ?? 'No se pudo cambiar el estado.');
      },
    });
  }

  submitDocente(): void {
    this.docenteSending = true;
    this.docenteMessage = null;
    this.docenteError = null;
    this.adminApi.registerDocente(this.docenteRegModel).subscribe({
      next: () => {
        this.docenteSending = false;
        this.docenteMessage = 'Docente registrado correctamente.';
        this.docenteRegModel = {
          name: '',
          lastName: '',
          email: '',
          password: '',
          docType: 'CC',
          docNumber: '',
        };
      },
      error: (err: { error?: { message?: string | string[] } }) => {
        this.docenteSending = false;
        const m = err?.error?.message;
        this.docenteError =
          (typeof m === 'string' ? m : Array.isArray(m) ? m.join(', ') : null) ??
          'No se pudo registrar el docente.';
      },
    });
  }

  loadCursos(): void {
    this.cursosLoading = true;
    this.cursosError = null;
    this.adminApi.getCursos().subscribe({
      next: (rows) => {
        this.cursos = rows;
        this.cursosLoading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.cursosError = err?.error?.message ?? 'No se pudieron cargar los cursos.';
        this.cursosLoading = false;
      },
    });
  }

  docenteNombre(c: CursoRow): string {
    const u = c.docente?.user;
    if (!u) return 'Sin asignar';
    return `${u.name} ${u.lastName}`.trim();
  }

  docenteInicial(c: CursoRow): string {
    const n = this.docenteNombre(c);
    return n === 'Sin asignar' ? '?' : n.charAt(0).toUpperCase();
  }

  dificultadNivel(c: CursoRow): number {
    const d = String(c.dificultad).toLowerCase();
    if (d.includes('alta')) return 5;
    if (d.includes('media')) return 3;
    return 2;
  }

  estadoLabel(c: CursoRow): string {
    return c.estado ? 'Activo' : 'Inactivo';
  }

  eliminarCurso(c: CursoRow): void {
    if (!confirm(`¿Eliminar el curso «${c.nombre}»?`)) return;
    this.adminApi.deleteCurso(c.id).subscribe({
      next: () => this.loadCursos(),
      error: () => alert('No se pudo eliminar el curso.'),
    });
  }

  toggleCurso(c: CursoRow): void {
    this.adminApi.toggleCurso(c.id).subscribe({
      next: () => this.loadCursos(),
      error: () => alert('No se pudo cambiar el estado.'),
    });
  }

  shortText(text: string | undefined, max: number): string {
    const t = text ?? '';
    return t.length > max ? `${t.slice(0, max)}…` : t;
  }

  private initCursoForm(mode: 'create' | 'edit', id: number | null): void {
    this.cursoFormMode = mode;
    this.cursoFormId = id;
    this.cursoFormLoading = true;
    this.cursoFormError = null;
    this.cursoDirigido = '';
    this.adminApi.getDocentes().subscribe({
      next: (d) => {
        this.cursoDocentes = d;
        if (mode === 'edit' && id) {
          this.adminApi.getCurso(id).subscribe({
            next: (c) => {
              this.cursoModel = {
                nombre: c.nombre,
                descripcion: c.descripcion,
                dificultad: c.dificultad,
                precio: Number(c.precio),
                estado: c.estado,
                docenteId: c.docente?.id ?? 0,
                estudiantesIds: c.estudiantes?.map((e) => e.id) ?? [],
              };
              this.cursoFormLoading = false;
            },
            error: () => {
              this.cursoFormError = 'No se pudo cargar el curso.';
              this.cursoFormLoading = false;
            },
          });
        } else {
          this.cursoModel = {
            nombre: '',
            descripcion: '',
            dificultad: 'Baja',
            precio: 0,
            estado: true,
            docenteId: d.length ? d[0].id : 0,
            estudiantesIds: [],
          };
          this.cursoFormLoading = false;
        }
      },
      error: () => {
        this.cursoFormError = 'No se pudieron cargar los docentes.';
        this.cursoFormLoading = false;
      },
    });
  }

  submitCurso(): void {
    this.cursoFormSaving = true;
    this.cursoFormError = null;
    const descripcion =
      this.cursoDirigido.trim().length > 0
        ? `Dirigido a: ${this.cursoDirigido.trim()}\n\n${this.cursoModel.descripcion}`
        : this.cursoModel.descripcion;

    const payload: CursoPayload = {
      ...this.cursoModel,
      descripcion,
      precio: Number(this.cursoModel.precio),
      docenteId: Number(this.cursoModel.docenteId),
      estudiantesIds: this.cursoModel.estudiantesIds ?? [],
    };

    const onErr = (err: unknown): void => {
      this.cursoFormSaving = false;
      const e = err as { error?: { message?: string | string[] } };
      const m = e?.error?.message;
      this.cursoFormError = Array.isArray(m) ? m.join(', ') : m ?? 'Error al guardar.';
    };

    if (this.cursoFormMode === 'create') {
      this.adminApi.createCurso(payload).subscribe({
        next: () => {
          this.cursoFormSaving = false;
          void this.router.navigateByUrl('/admin/cursos');
        },
        error: onErr,
      });
    } else if (this.cursoFormId) {
      this.adminApi.updateCurso(this.cursoFormId, payload).subscribe({
        next: () => {
          this.cursoFormSaving = false;
          void this.router.navigateByUrl('/admin/cursos');
        },
        error: onErr,
      });
    }
  }

  private loadMensajes(): void {
    this.msgLoading = true;
    this.msgError = null;
    this.adminApi.getStudentEmails().subscribe({
      next: (rows) => {
        this.msgStudents = rows;
        this.msgLoading = false;
      },
      error: () => {
        this.msgError = 'No se pudo cargar la lista de estudiantes.';
        this.msgLoading = false;
      },
    });
  }

  toggleMsgEmail(email: string, checked: boolean): void {
    if (checked) this.msgSelected.add(email);
    else this.msgSelected.delete(email);
  }

  isMsgChecked(email: string): boolean {
    return this.msgSelected.has(email);
  }

  selectAllMsgs(checked: boolean): void {
    this.msgSelected.clear();
    if (checked) {
      for (const s of this.msgStudents) {
        this.msgSelected.add(s.email);
      }
    }
  }

  sendMsgs(): void {
    const emails = [...this.msgSelected];
    if (!emails.length) {
      this.msgError = 'Selecciona al menos un destinatario.';
      return;
    }
    if (!this.msgBody.trim()) {
      this.msgError = 'Escribe un mensaje.';
      return;
    }
    this.msgSending = true;
    this.msgInfo = null;
    this.msgError = null;
    this.adminApi.sendBulkMail(emails, this.msgBody.trim()).subscribe({
      next: (res) => {
        this.msgSending = false;
        this.msgInfo = `Enviado correctamente a ${res.sent} correo(s).`;
      },
      error: (err: { error?: { message?: string } }) => {
        this.msgSending = false;
        this.msgError =
          err?.error?.message ??
          'No se pudo enviar (revisa la configuración SMTP del servidor Nest).';
      },
    });
  }
}
