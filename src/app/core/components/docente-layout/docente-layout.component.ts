import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Auth } from '../../services/auth';
import { DocenteApiService, type CursoDocente } from '../../services/docente-api.service';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';
import { LayoutDashboard, BookOpen, LogOut, ClipboardList, MessageSquare, Mail, Sun, Moon } from 'lucide-angular';

export type DocentePanelView = 'dashboard' | 'mis-cursos' | 'tareas' | 'foros' | 'mensajes' | null;

const THEME_KEY = 'codipayco-admin-theme';

@Component({
  selector: 'app-docente-layout',
  templateUrl: './docente-layout.component.html',
  styleUrl: './docente-layout.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    DashboardLayoutComponent,
    AdminLucideIconsModule,
  ],
})
export class DocenteLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly docenteApi = inject(DocenteApiService);
  public readonly authService = inject(Auth);

  readonly docentePanelView = signal<DocentePanelView>(null);
  readonly isDarkMode = signal(false);

  readonly userDisplayName = computed(() => {
    const u = this.authService.currentUser();
    const full = [u?.name, u?.lastName]
      .map((s) => s?.trim())
      .filter((s): s is string => !!s && s.length > 0)
      .join(' ');
    return full.length > 0 ? full : 'Docente';
  });

  readonly userRoleLabel = computed(() => {
    const role = this.authService.currentUser()?.roles?.[0]?.name;
    return role?.trim() || 'Docente';
  });

  readonly userEmail = computed(() => this.authService.currentUser()?.email?.trim() ?? '');

  readonly userDocNumber = computed(() => this.authService.currentUser()?.docNumber?.trim() ?? '');

  readonly userInitial = computed(() => {
    const name = this.userDisplayName();
    return (name.split(/\s+/)[0]?.[0] ?? 'D').toUpperCase();
  });

  perfilError: string | null = null;
  selectedFile: File | null = null;
  uploadSuccess = false;

  readonly misCursosSig = signal<CursoDocente[]>([]);
  cursosLoading = false;
  cursosError: string | null = null;

  readonly misStats = computed(() => {
    const userId = this.authService.currentUser()?.id;
    const mis = this.misCursosSig().filter((c) => c.docente?.user?.id === userId);
    return {
      totalCursos: mis.length,
      cursosActivos: mis.filter((c) => c.estado).length,
      totalEstudiantes: mis.reduce((acc, c) => acc + (c.estudiantes?.length ?? 0), 0),
    };
  });

  protected readonly iDash = LayoutDashboard;
  protected readonly iCourses = BookOpen;
  protected readonly iLogOut = LogOut;
  protected readonly iTareas = ClipboardList;
  protected readonly iForos = MessageSquare;
  protected readonly iMensajes = Mail;
  protected readonly iSun = Sun;
  protected readonly iMoon = Moon;

  // Mensajes state
  activeTabMensajes: 'enviar' | 'enviados' | 'recibidos' = 'enviar';
  msgDestinatarioId = 0;
  msgContenido = '';
  msgSendingDocente = false;
  msgInfoDocente: string | null = null;
  msgErrorDocente: string | null = null;

  // Foros state
  foroTitulo = '';
  foroCursoId = 0;
  foroDescripcion = '';
  foroSending = false;
  foroInfo: string | null = null;
  foroError: string | null = null;

  private lastViewKey = '';

  constructor() {
    this.applyDocenteRoute(this.router.url);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.applyDocenteRoute(e.urlAfterRedirects));
  }

  ngOnInit(): void {
    const saved = localStorage.getItem(THEME_KEY);
    this.isDarkMode.set(saved === 'dark');
    document.body.classList.toggle('dark', saved === 'dark');
  }

  toggleDarkMode(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    document.body.classList.toggle('dark', next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  }

  logout(): void {
    this.authService.logout();
  }

  private parseDocentePath(path: string): DocentePanelView {
    if (path.includes('/docente/mis-cursos')) return 'mis-cursos';
    if (path.includes('/docente/tareas')) return 'tareas';
    if (path.includes('/docente/foros')) return 'foros';
    if (path.includes('/docente/mensajes')) return 'mensajes';
    if (path.includes('/docente/dashboard') || path === '/docente' || path === '/docente/')
      return 'dashboard';
    return 'dashboard';
  }

  private applyDocenteRoute(fullUrl: string): void {
    const path = fullUrl.split('?')[0];
    if (!path.startsWith('/docente')) {
      this.docentePanelView.set(null);
      return;
    }
    const view = this.parseDocentePath(path);
    const key = `${view}:${path}`;
    if (key === this.lastViewKey) return;
    this.lastViewKey = key;
    this.docentePanelView.set(view);

    if (view === 'dashboard' || view === 'mis-cursos' || view === 'tareas' || view === 'foros') {
      this.loadCursos();
    }
  }

  loadCursos(): void {
    if (this.misCursosSig().length) return;
    this.cursosLoading = true;
    this.cursosError = null;
    this.docenteApi.getCursos().subscribe({
      next: (rows) => {
        this.misCursosSig.set(rows);
        this.cursosLoading = false;
      },
      error: () => {
        this.cursosError = 'No se pudieron cargar los cursos.';
        this.cursosLoading = false;
      },
    });
  }

  get misCursosFiltered(): CursoDocente[] {
    const userId = this.authService.currentUser()?.id;
    return this.misCursosSig().filter((c) => c.docente?.user?.id === userId);
  }

  shortText(text: string | undefined, max: number): string {
    const t = text ?? '';
    return t.length > max ? `${t.slice(0, max)}…` : t;
  }

  dificultadNivel(c: CursoDocente): number {
    const d = String(c.dificultad).toLowerCase();
    if (d.includes('alta')) return 5;
    if (d.includes('media')) return 3;
    return 2;
  }

  estadoLabel(c: CursoDocente): string {
    return c.estado ? 'Activo' : 'Inactivo';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.uploadSuccess = false;
    this.perfilError = null;
  }

  uploadProfileImage(): void {
    if (!this.selectedFile) return;
    this.perfilError = null;
    this.uploadSuccess = true;
    this.selectedFile = null;
  }

  crearForo(): void {
    if (!this.foroTitulo || !this.foroCursoId || !this.foroDescripcion) return;
    this.foroSending = true;
    this.foroInfo = null;
    this.foroError = null;
    setTimeout(() => {
      this.foroInfo = 'Foro creado exitosamente.';
      this.foroTitulo = '';
      this.foroCursoId = 0;
      this.foroDescripcion = '';
      this.foroSending = false;
    }, 600);
  }

  enviarMensajeDocente(): void {
    if (!this.msgDestinatarioId || !this.msgContenido) return;
    this.msgSendingDocente = true;
    this.msgInfoDocente = null;
    this.msgErrorDocente = null;
    setTimeout(() => {
      this.msgInfoDocente = 'Mensaje enviado correctamente.';
      this.msgContenido = '';
      this.msgDestinatarioId = 0;
      this.msgSendingDocente = false;
    }, 600);
  }
}
