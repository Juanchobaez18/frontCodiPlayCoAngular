import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Auth } from '../../services/auth';
import {
  userHasAdminPanelAccess,
  userIsProtectedSystemAdmin,
} from '../../config/admin-panel-access.config';
import {
  AdminApiService,
  type AdminRoleOption,
  type CursoPayload,
  type CursoRow,
  type DashboardStats,
  type DocenteRow,
  type ManagedUser,
  type StudentEmailRow,
} from '../../services/admin-api.service';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Mail, LogOut, Moon, Sun,
  Zap, UserPlus, User, Pencil, Trash2, AlertCircle, CheckCircle,
  CreditCard, Hash, Lock, KeyRound, Info, X, Plus, ArrowLeft,
  Star, Send, Save, LayoutList,
} from 'lucide-angular';

export type AdminPanelView =
  | 'dashboard'
  | 'usuarios'
  | 'docentes'
  | 'cursos'
  | 'curso-create'
  | 'curso-edit'
  | 'mensajes'
  | null;

const THEME_STORAGE_KEY = 'codipayco-admin-theme';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    DashboardLayoutComponent,
    AdminLucideIconsModule,
  ],
})
export class AdminLayoutComponent implements OnInit {
  public authService = inject(Auth);
  private readonly adminApi = inject(AdminApiService);
  private readonly router = inject(Router);

  readonly isDarkMode = signal(false);

  readonly userDisplayName = computed(() => {
    const u = this.authService.currentUser();
    const full = [u?.name, u?.lastName]
      .map((s) => s?.trim())
      .filter((s): s is string => !!s && s.length > 0)
      .join(' ');
    return full.length > 0 ? full : 'Admin';
  });

  readonly userRoleLabel = computed(() => {
    const role = this.authService.currentUser()?.roles?.[0]?.name;
    return role?.trim() || 'Administrador';
  });

  readonly userEmail = computed(() => this.authService.currentUser()?.email?.trim() ?? '');

  readonly userInitial = computed(() => {
    const name = this.userDisplayName();
    return (name.split(/\s+/)[0]?.[0] ?? 'A').toUpperCase();
  });

  // sidebar
  protected readonly iDash     = LayoutDashboard;
  protected readonly iUsers    = Users;
  protected readonly iDocentes = GraduationCap;
  protected readonly iCourses  = BookOpen;
  protected readonly iMensajes = Mail;
  protected readonly iLogOut   = LogOut;
  protected readonly iSun      = Sun;
  protected readonly iMoon     = Moon;
  // content
  protected readonly iZap          = Zap;
  protected readonly iUserPlus     = UserPlus;
  protected readonly iUser         = User;
  protected readonly iPencil       = Pencil;
  protected readonly iTrash        = Trash2;
  protected readonly iAlertCircle  = AlertCircle;
  protected readonly iCheckCircle  = CheckCircle;
  protected readonly iCreditCard   = CreditCard;
  protected readonly iHash         = Hash;
  protected readonly iLock         = Lock;
  protected readonly iKey          = KeyRound;
  protected readonly iInfo         = Info;
  protected readonly iX            = X;
  protected readonly iPlus         = Plus;
  protected readonly iArrowLeft    = ArrowLeft;
  protected readonly iStar         = Star;
  protected readonly iSend         = Send;
  protected readonly iSave         = Save;
  protected readonly iList         = LayoutList;

  adminPanelView = signal<AdminPanelView>(null);
  private lastAdminDataKey = '';

  // dashboard
  dashboardStats: DashboardStats | null = null;
  dashboardLoading = false;
  dashboardError: string | null = null;

  // usuarios
  users: ManagedUser[] = [];
  usersLoading = false;
  usersError: string | null = null;
  rolesCatalogLoaded = false;
  rolesCatalog: AdminRoleOption[] = [];
  userEditError: string | null = null;
  userEditModalOpen = false;
  userEditSaving = false;
  userEditForm: {
    id: number; name: string; lastName: string; email: string;
    docType: string; docNumber: string; isActive: boolean;
    roleIds: number[]; password: string;
  } = { id: 0, name: '', lastName: '', email: '', docType: 'CC', docNumber: '', isActive: true, roleIds: [], password: '' };

  // docentes
  docenteSending = false;
  docenteMessage: string | null = null;
  docenteError: string | null = null;
  docenteRegModel: { name: string; lastName: string; email: string; password: string; docType: string; docNumber: string } =
    { name: '', lastName: '', email: '', password: '', docType: 'CC', docNumber: '' };

  // cursos
  cursos: CursoRow[] = [];
  cursosLoading = false;
  cursosError: string | null = null;
  cursoFormMode: 'create' | 'edit' = 'create';
  cursoFormId: number | null = null;
  cursoFormLoading = false;
  cursoFormError: string | null = null;
  cursoDirigido = '';
  cursoDocentes: DocenteRow[] = [];
  cursoFormSaving = false;
  cursoModel: {
    nombre: string; descripcion: string; dificultad: string;
    precio: number; estado: boolean; docenteId: number; estudiantesIds: number[];
  } = { nombre: '', descripcion: '', dificultad: 'Baja', precio: 0, estado: true, docenteId: 0, estudiantesIds: [] };

  // mensajes
  msgStudents: StudentEmailRow[] = [];
  msgSelected = new Set<string>();
  msgLoading = false;
  msgError: string | null = null;
  msgBody = '';
  msgSending = false;
  msgInfo: string | null = null;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.applyAdminRoute(e.urlAfterRedirects));
    this.applyAdminRoute(this.router.url);
  }

  ngOnInit(): void {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    this.isDarkMode.set(saved === 'dark');
    document.body.classList.toggle('dark', saved === 'dark');
  }

  toggleDarkMode(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    document.body.classList.toggle('dark', next);
    localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
  }

  logout(): void {
    this.authService.logout();
  }

  isAppAdmin(): boolean {
    return userHasAdminPanelAccess(this.authService.currentUser());
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

  private isEstudianteUser(u: ManagedUser): boolean {
    return (
      u.roles?.some(
        (r) =>
          String(r.name).toUpperCase() === 'USUARIO' ||
          String(r.name).toUpperCase() === 'ESTUDIANTE' ||
          r.id === 3,
      ) ?? false
    );
  }

  private loadDashboard(): void {
    this.dashboardLoading = true;
    this.dashboardError = null;
    forkJoin([this.adminApi.getDashboardStats(), this.adminApi.getManagedUsers()]).subscribe({
      next: ([stats, users]) => {
        const totalEstudiantes = users.filter((u) => this.isEstudianteUser(u)).length;
        const totalEstudiantesActivos = users.filter(
          (u) => this.isEstudianteUser(u) && u.isActive,
        ).length;
        this.dashboardStats = {
          ...stats,
          totalEstudiantes,
          totalEstudiantesActivos,
        };
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
