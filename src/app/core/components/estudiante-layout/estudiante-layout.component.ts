import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Auth } from '../../services/auth';
import {
  EstudianteApiService,
  type EstudianteProfile,
  type ForoListItem,
  type MensajeEstudiante,
  type ModuloBackend,
  type LeccionBackend,
} from '../../services/estudiante-api.service';
import {
  MODULOS_PANEL,
  getModuloConfig,
  type ModuloPanelConfig,
} from './estudiante-modulos.data';
import {
  getLeccionContent,
  type LeccionVistaCodiContent,
} from './lecciones-vistascodi.data';

export type EstudiantePanelView =
  | 'inicio'
  | 'mis-cursos'
  | 'mis-logros'
  | 'bandeja'
  | 'foros'
  | 'foro-detalle'
  | 'editar-perfil'
  | 'soporte'
  | 'modulo'
  | 'curso-modulos'
  | 'leccion';

const THEME_KEY = 'codiplay-theme';
const DEFAULT_AVATAR =
  '/assetsPanelUsuaario/22b8078e-03d9-49d7-a4a6-f70b4208e8c9-removebg-preview.png';
const API_MEDIA = 'http://localhost:3000';

/** Banner y fondo del inicio (reemplazables en `public/assetsPanelUsuaario/`). */
export const ESTUDIANTE_INICIO_HERO = '/assetsPanelUsuaario/inicio-hero-banner.png';
export const ESTUDIANTE_INICIO_BG = '/assetsPanelUsuaario/inicio-bg-paisaje.png';

@Component({
  selector: 'app-estudiante-layout',
  standalone: true,
  templateUrl: './estudiante-layout.component.html',
  styleUrls: ['./estudiante-layout.component.scss', './estudiante-inicio.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, NgClass, FormsModule, RouterLink, RouterLinkActive],
})
export class EstudianteLayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly api = inject(EstudianteApiService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly auth = inject(Auth);

  readonly panelView = signal<EstudiantePanelView>('inicio');
  readonly profile = signal<EstudianteProfile | null>(null);
  readonly foros = signal<ForoListItem[]>([]);
  readonly foroDetalle = signal<(ForoListItem & { respuestas?: unknown[] }) | null>(null);
  readonly moduloActivo = signal<ModuloPanelConfig | null>(null);
  readonly modulosPanel = MODULOS_PANEL;
  readonly modulosBE = signal<ModuloBackend[]>([]);
  readonly moduloActivoBE = signal<ModuloBackend | null>(null);
  readonly leccionActiva = signal<LeccionBackend | null>(null);
  readonly leccionStaticContent = signal<LeccionVistaCodiContent | null>(null);
  readonly leccionPasoActual = signal(0);
  cursoModulosId = 0;
  moduloLoading = false;
  leccionLoading = false;
  hoveredLeccion = 0;

  loadingProfile = false;
  profileError: string | null = null;
  forosLoading = false;
  forosError: string | null = null;

  userMenuOpen = false;
  sidebarOpen = false;
  isDarkMode = false;

  bandejaTab: 'recibidos' | 'enviados' = 'recibidos';

  soporteName = '';
  soporteEmail = '';
  soporteMessage = '';
  soporteSending = false;
  soporteInfo: string | null = null;
  soporteError: string | null = null;

  perfilForm = {
    name: '',
    lastName: '',
    email: '',
    docType: '',
    docNumber: '',
    fechanacimiento: '',
    edad: 0,
  };
  perfilSaving = false;
  perfilInfo: string | null = null;
  perfilErrorForm: string | null = null;
  selectedAvatar: File | null = null;

  readonly userDisplayName = computed(() => {
    const u = this.auth.currentUser();
    const full = [u?.name, u?.lastName]
      .map((s) => s?.trim())
      .filter((s): s is string => !!s && s.length > 0)
      .join(' ');
    return full.length > 0 ? full : 'Usuario';
  });

  readonly avatarUrl = computed(() => {
    const path = this.auth.currentUser()?.avatar ?? this.profile()?.user?.avatar;
    if (!path) return DEFAULT_AVATAR;
    if (path.startsWith('http')) return path;
    return `${API_MEDIA}/${path.replace(/^\//, '')}`;
  });

  readonly useAvatarImage = computed(() => {
    const url = this.avatarUrl();
    return !url.includes('22b8078e-03d9-49d7-a4a6-f70b4208e8c9');
  });

  readonly userInitial = computed(() => {
    const name = this.userDisplayName();
    return (name.split(/\s+/)[0]?.[0] ?? 'U').toUpperCase();
  });

  readonly inicioHero = ESTUDIANTE_INICIO_HERO;
  readonly firstCursoId = computed(() => this.profile()?.cursos?.[0]?.id ?? 0);

  private lastRouteKey = '';

  constructor() {
    this.applyRoute(this.router.url);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.applyRoute(e.urlAfterRedirects));
  }

  ngOnInit(): void {
    document.body.classList.add('estudiante-panel-root');
    const saved = localStorage.getItem(THEME_KEY);
    this.isDarkMode = saved === 'dark';
    if (this.isDarkMode) document.body.classList.add('dark-mode');
    this.loadProfile();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('estudiante-panel-root', 'dark-mode');
  }

  private applyRoute(fullUrl: string): void {
    const path = fullUrl.split('?')[0];
    if (!path.startsWith('/estudiante')) return;

    let view: EstudiantePanelView = 'inicio';
    if (path.includes('/mis-cursos')) view = 'mis-cursos';
    else if (path.includes('/mis-logros')) view = 'mis-logros';
    else if (path.includes('/bandeja')) view = 'bandeja';
    else if (path.match(/\/foros\/\d+/)) view = 'foro-detalle';
    else if (path.includes('/foros')) view = 'foros';
    else if (path.includes('/editar-perfil')) view = 'editar-perfil';
    else if (path.includes('/soporte')) view = 'soporte';
    else if (path.includes('/modulo-lista/')) view = 'curso-modulos';
    else if (path.includes('/leccion/')) view = 'leccion';
    else if (path.includes('/modulo/')) view = 'modulo';
    else if (path.includes('/inicio')) view = 'inicio';

    const key = `${view}:${path}`;
    if (key === this.lastRouteKey) return;
    this.lastRouteKey = key;
    this.panelView.set(view);

    if (view === 'modulo') {
      const id = Number(path.split('/modulo/')[1]?.split('/')[0] ?? '0');
      if (id > 0) this.loadModulo(id);
      else this.moduloActivoBE.set(null);
      this.moduloActivo.set(getModuloConfig(id) ?? null);
    } else if (view === 'curso-modulos') {
      const cursoId = Number(path.split('/modulo-lista/')[1]?.split('/')[0] ?? '0');
      this.cursoModulosId = cursoId;
      if (cursoId > 0) this.loadModulosBE(cursoId);
    } else if (view === 'leccion') {
      const leccionId = Number(path.split('/leccion/')[1]?.split('/')[0] ?? '0');
      if (leccionId > 0) this.loadLeccion(leccionId);
    } else {
      this.moduloActivo.set(null);
      this.moduloActivoBE.set(null);
    }

    if (view === 'foro-detalle') {
      const id = Number(path.split('/foros/')[1]?.split('/')[0] ?? '0');
      if (id > 0) this.loadForoDetalle(id);
    }

    if (view === 'foros') this.loadForos();
    if (view === 'editar-perfil') this.syncPerfilForm();
  }

  loadProfile(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.loadingProfile = true;
    this.profileError = null;
    this.api.getProfileByUserId(userId).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.loadingProfile = false;
        this.syncPerfilForm();
      },
      error: (err) => {
        this.profileError =
          err?.error?.message ?? 'No se pudo cargar tu perfil de estudiante.';
        this.loadingProfile = false;
      },
    });
  }

  private syncPerfilForm(): void {
    const p = this.profile();
    const u = p?.user ?? this.auth.currentUser();
    if (!u) return;
    this.perfilForm = {
      name: u.name ?? '',
      lastName: u.lastName ?? '',
      email: u.email ?? '',
      docType: (u as { docType?: string }).docType ?? '',
      docNumber: (u as { docNumber?: string }).docNumber ?? '',
      fechanacimiento: p?.fechanacimiento ?? '',
      edad: p?.edad ?? 0,
    };
  }

  loadForos(): void {
    if (this.foros().length) return;
    this.forosLoading = true;
    this.forosError = null;
    this.api.getForos().subscribe({
      next: (rows) => {
        this.foros.set(rows);
        this.forosLoading = false;
      },
      error: () => {
        this.forosError = 'No se pudieron cargar los foros.';
        this.forosLoading = false;
      },
    });
  }

  loadForoDetalle(id: number): void {
    this.api.getForo(id).subscribe({
      next: (f) => this.foroDetalle.set(f),
      error: () => this.foroDetalle.set(null),
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    localStorage.setItem(THEME_KEY, this.isDarkMode ? 'dark' : 'light');
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      this.sidebarOpen &&
      !target.closest('.sidebar') &&
      !target.closest('.mobile-nav-toggle')
    ) {
      this.sidebarOpen = false;
    }
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    this.auth.logout();
  }

  modProgress(mod: ModuloPanelConfig): { done: number; pct: number } {
    const total = mod.totalLecciones;
    const progreso = this.profile()?.progreso ?? 0;
    const done = Math.min(total, Math.floor((progreso / 100) * total));
    return { done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  isModuloLocked(mod: ModuloPanelConfig): boolean {
    return mod.locked;
  }

  moduloRingClass(accent: ModuloPanelConfig['accent']): string {
    return `modulo-card-v2__ring--${accent}`;
  }

  cursosInscritos() {
    return this.profile()?.cursos ?? [];
  }

  mensajesRecibidos(): MensajeEstudiante[] {
    return (this.profile()?.mensajes ?? []).filter((m) => m.remitenteTipo === 'docente');
  }

  mensajesEnviados(): MensajeEstudiante[] {
    return (this.profile()?.mensajes ?? []).filter((m) => m.remitenteTipo === 'estudiante');
  }

  forosAgrupadosPorCurso(): { curso: string; items: ForoListItem[] }[] {
    const map = new Map<string, ForoListItem[]>();
    for (const f of this.foros()) {
      const key = f.curso?.nombre ?? 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return Array.from(map.entries()).map(([curso, items]) => ({ curso, items }));
  }

  dificultadLabel(d?: string): string {
    const v = String(d ?? '').toLowerCase();
    if (v.includes('alta')) return 'Avanzado';
    if (v.includes('media')) return 'Intermedio';
    return 'Básico';
  }

  precioLabel(p: number | string | undefined): string {
    const n = Number(p ?? 0);
    return `$${n.toFixed(2)}`;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedAvatar = input.files?.[0] ?? null;
  }

  guardarPerfil(): void {
    const userId = this.auth.currentUser()?.id;
    const estId = this.profile()?.id ?? this.auth.currentUser()?.estudiante?.id;
    if (!userId) return;

    this.perfilSaving = true;
    this.perfilInfo = null;
    this.perfilErrorForm = null;

    const saveUser = () => {
      this.api
        .updateUser(userId, {
          name: this.perfilForm.name,
          lastName: this.perfilForm.lastName,
          email: this.perfilForm.email,
          docType: this.perfilForm.docType,
          docNumber: this.perfilForm.docNumber,
        })
        .subscribe({
          next: () => {
            if (estId) {
              this.api
                .updateEstudiante(estId, {
                  fechanacimiento: this.perfilForm.fechanacimiento,
                  edad: Number(this.perfilForm.edad),
                })
                .subscribe({
                  next: () => this.finishPerfilSave(),
                  error: (err) => this.failPerfil(err),
                });
            } else {
              this.finishPerfilSave();
            }
          },
          error: (err) => this.failPerfil(err),
        });
    };

    if (this.selectedAvatar) {
      this.api.uploadAvatar(userId, this.selectedAvatar).subscribe({
        next: () => {
          this.selectedAvatar = null;
          saveUser();
        },
        error: (err) => this.failPerfil(err),
      });
    } else {
      saveUser();
    }
  }

  private finishPerfilSave(): void {
    this.perfilSaving = false;
    this.perfilInfo = 'Perfil actualizado correctamente.';
    this.auth.checkAuthStatus().subscribe();
    this.loadProfile();
  }

  private failPerfil(err: { error?: { message?: string } }): void {
    this.perfilSaving = false;
    this.perfilErrorForm = err?.error?.message ?? 'No se pudo guardar el perfil.';
  }

  enviarSoporte(): void {
    if (!this.soporteName.trim() || !this.soporteEmail.trim()) return;
    this.soporteSending = true;
    this.soporteInfo = null;
    this.soporteError = null;
    this.api
      .enviarSoporte({
        name: this.soporteName.trim(),
        email: this.soporteEmail.trim(),
        message: this.soporteMessage.trim() || 'Solicitud desde panel estudiante',
      })
      .subscribe({
        next: () => {
          this.soporteInfo = 'Mensaje enviado. Te contactaremos pronto.';
          this.soporteName = '';
          this.soporteEmail = '';
          this.soporteMessage = '';
          this.soporteSending = false;
        },
        error: () => {
          this.soporteError = 'No se pudo enviar el mensaje de soporte.';
          this.soporteSending = false;
        },
      });
  }

  goBack(): void {
    window.history.back();
  }

  safeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  loadModulosBE(cursoId: number): void {
    this.moduloLoading = true;
    this.api.getModulosByCurso(cursoId).subscribe({
      next: (mods) => {
        this.modulosBE.set(mods);
        this.moduloLoading = false;
      },
      error: () => { this.moduloLoading = false; },
    });
  }

  loadModulo(id: number): void {
    this.moduloLoading = true;
    this.api.getModulo(id).subscribe({
      next: (mod) => {
        this.moduloActivoBE.set(mod);
        this.moduloLoading = false;
      },
      error: () => {
        this.moduloActivoBE.set(null);
        this.moduloLoading = false;
      },
    });
  }

  loadLeccion(id: number): void {
    this.leccionLoading = true;
    this.leccionPasoActual.set(0);
    this.leccionStaticContent.set(null);
    this.api.getLeccion(id).subscribe({
      next: (lec) => {
        this.leccionActiva.set(lec);
        this.resolveStaticContent(lec);
        this.leccionLoading = false;
      },
      error: () => {
        this.leccionActiva.set(null);
        this.leccionLoading = false;
      },
    });
  }

  private resolveStaticContent(lec: LeccionBackend): void {
    const mod = this.moduloActivoBE();
    if (!mod) return;
    const modOrden = mod.orden ?? 1;
    const content = getLeccionContent(modOrden, lec.orden);
    this.leccionStaticContent.set(content ?? null);
  }

  siguientePaso(): void {
    const content = this.leccionStaticContent();
    if (!content) return;
    const max = content.pasos.length - 1;
    if (this.leccionPasoActual() < max) this.leccionPasoActual.update(v => v + 1);
  }

  anteriorPaso(): void {
    if (this.leccionPasoActual() > 0) this.leccionPasoActual.update(v => v - 1);
  }

  formatFecha(value: string | Date | undefined): string {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('es-CO');
  }
}
