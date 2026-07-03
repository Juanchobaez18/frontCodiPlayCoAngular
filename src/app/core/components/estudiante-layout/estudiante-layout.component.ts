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
import { Subscription } from 'rxjs';
import { ProgressWsService } from '../../services/progress-ws.service';
import { BadgeConfig, todasLasInsigniasConEstado, BadgeContext } from '../../config/badges.config';
import { Auth } from '../../services/auth';
import {
  EstudianteApiService,
  type EstudianteProfile,
  type ForoListItem,
  type MensajeEstudiante,
  type ModuloBackend,
  type LeccionBackend,
  type TareaEntregaEstudiante,
} from '../../services/estudiante-api.service';
import { StorageService } from '../../services/storage.service';
import {
  MODULOS_PANEL,
  getModuloConfig,
  type ModuloPanelConfig,
} from './estudiante-modulos.data';
import {
  getLeccionContent,
  type LeccionVistaCodiContent,
  type EditorConfig,
} from './lecciones-vistascodi.data';
import { environment } from '../../../../environments/environment';

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
  private readonly storage = inject(StorageService);
  readonly auth = inject(Auth);

  readonly panelView = signal<EstudiantePanelView>('inicio');
  readonly profile = signal<EstudianteProfile | null>(null);
  readonly foros = signal<ForoListItem[]>([]);
  readonly foroDetalle = signal<(ForoListItem & { respuestas?: any[] }) | null>(null);
  readonly moduloActivo = signal<ModuloPanelConfig | null>(null);
  readonly modulosPanel = MODULOS_PANEL;
  readonly modulosBE = signal<ModuloBackend[]>([]);
  readonly moduloActivoBE = signal<ModuloBackend | null>(null);
  readonly leccionActiva = signal<LeccionBackend | null>(null);
  readonly leccionStaticContent = signal<LeccionVistaCodiContent | null>(null);
  readonly leccionPasoActual = signal(0);
  cursoModulosId = 0;
  moduloPanelNum = 0;
  leccionPanelOrden = 0;
  moduloLoading = false;
  leccionLoading = false;

  // WebSocket de progreso
  private readonly progressWs = inject(ProgressWsService);
  private wsSub?: Subscription;

  // === NOTIFICACIONES ===
  readonly mensajesNoLeidos = computed(() => {
    return this.mensajesRecibidos().filter((m) => m.estado !== 'leido').length;
  });

  readonly forosNuevos = signal(0);

  // Logros / Insignias
  readonly insignias = signal<(BadgeConfig & { desbloqueada: boolean })[]>([]);
  readonly progresoModulosDetalle = signal<{
    moduloId: number;
    moduloTitulo: string;
    totalLecciones: number;
    leccionesCompletadas: number;
    porcentaje: number;
  }[]>([]);

  // Editor de código
  editorCode = '';
  editorMsg = '';
  editorSuccess = false;
  editorPreviewId = 'code-preview-box';

  // Paint tool
  paintTool: 'pencil' | 'eraser' | 'rect' | 'circle' | 'line' = 'pencil';
  paintColor = '#00eaff';
  paintSize = 8;
  private paintCanvas: HTMLCanvasElement | null = null;
  private paintCtx: CanvasRenderingContext2D | null = null;
  private paintDrawing = false;
  private paintStartX = 0;
  private paintStartY = 0;
  private paintSnapshot: ImageData | null = null;
  hoveredLeccion = 0;

  loadingProfile = false;
  profileError: string | null = null;
  forosLoading = false;
  forosError: string | null = null;

  userMenuOpen = false;
  sidebarOpen = false;
  isDarkMode = false;

  bandejaTab: 'recibidos' | 'enviados' = 'recibidos';
  leccionCompletadaMsg = '';

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

  avatarPreview: string | null = null;
  avatarUploading = false;
  avatarUploadInfo: string | null = null;
  avatarUploadError: string | null = null;

  nuevaRespuestaForo = '';
  enviandoRespuestaForo = false;

  respuestasBandeja: Record<number, string> = {};
  enviandoRespuestaBandeja: Record<number, boolean> = {};

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
    return `${environment.apiUrl}/${path.replace(/^\//, '')}`;
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
    const saved = this.storage.getItem(THEME_KEY);
    this.isDarkMode = saved === 'dark';
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    this.loadProfile();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('estudiante-panel-root', 'dark-mode');
    this.wsSub?.unsubscribe();
    this.progressWs.disconnect();
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
    else if (path.includes('/leccion-panel/')) view = 'leccion';
    else if (path.includes('/modulo-panel/')) view = 'modulo';
    else if (path.includes('/leccion/')) view = 'leccion';
    else if (path.includes('/modulo/')) view = 'modulo';
    else if (path.includes('/inicio')) view = 'inicio';

    const key = `${view}:${path}`;
    if (key === this.lastRouteKey) return;
    this.lastRouteKey = key;
    this.panelView.set(view);

    if (view === 'modulo') {
      if (path.includes('/modulo-panel/')) {
        const num = Number(path.split('/modulo-panel/')[1]?.split('/')[0] ?? '0');
        this.loadModuloPanel(num);
      } else {
        const id = Number(path.split('/modulo/')[1]?.split('/')[0] ?? '0');
        this.moduloActivo.set(null);
        this.moduloPanelNum = 0;
        if (id > 0) this.loadModulo(id);
        else this.moduloActivoBE.set(null);
      }
    } else if (view === 'curso-modulos') {
      const cursoId = Number(path.split('/modulo-lista/')[1]?.split('/')[0] ?? '0');
      this.cursoModulosId = cursoId;
      if (cursoId > 0) this.loadModulosBE(cursoId);
    } else if (view === 'leccion') {
      if (path.includes('/leccion-panel/')) {
        const parts = path.split('/leccion-panel/')[1]?.split('/') ?? [];
        const mod = Number(parts[0] ?? '0');
        const lec = Number(parts[1] ?? '0');
        if (mod > 0 && lec > 0) this.loadLeccionPanel(mod, lec);
      } else {
        const leccionId = Number(path.split('/leccion/')[1]?.split('/')[0] ?? '0');
        this.moduloPanelNum = 0;
        if (leccionId > 0) this.loadLeccion(leccionId);
      }
    } else {
      this.moduloActivo.set(null);
      this.moduloActivoBE.set(null);
      this.moduloPanelNum = 0;
    }

    if (view === 'foro-detalle') {
      const id = Number(path.split('/foros/')[1]?.split('/')[0] ?? '0');
      if (id > 0) {
        this.loadForoDetalle(id);
        const currentSeenId = Number(localStorage.getItem('estudiante-foros-last-id') ?? '0');
        if (id > currentSeenId) {
          localStorage.setItem('estudiante-foros-last-id', id.toString());
        }
      }
      this.forosNuevos.set(0);
    }

    if (view === 'foros') {
      this.loadForos();
      this.forosNuevos.set(0);
    }
    if (view === 'bandeja') {
      this.marcarMensajesRecibidosComoLeidos();
    }
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
        
        const loadModsAndCalc = (profileData: any) => {
          if (profileData.cursos && profileData.cursos.length > 0) {
            this.api.getModulosByCurso(profileData.cursos[0].id).subscribe({
              next: (mods) => {
                this.modulosBE.set(mods);
                this.calcularInsigniasYProgreso(profileData);
              },
              error: () => {
                this.calcularInsigniasYProgreso(profileData);
              }
            });
          } else {
            this.calcularInsigniasYProgreso(profileData);
          }
        };

        loadModsAndCalc(p);
        this._checkForosNuevos();

        // Conectar WebSocket al canal personal del estudiante
        if (p.id) {
          this.progressWs.joinEstudiante(p.id);
          this.wsSub?.unsubscribe();
          this.wsSub = this.progressWs.progreso$.subscribe((event) => {
            if (event.estudianteId === p.id) {
              // Recargar perfil para obtener leccionesCompletadas actualizadas
              this.api.getProfileByUserId(userId).subscribe({
                next: (updated) => {
                  this.profile.set(updated);
                  loadModsAndCalc(updated);
                  if (this.panelView() === 'bandeja') {
                    this.marcarMensajesRecibidosComoLeidos();
                  }
                },
              });
            }
          });
        }
        if (this.panelView() === 'bandeja') {
          this.marcarMensajesRecibidosComoLeidos();
        }
      },
      error: (err) => {
        this.profileError =
          err?.error?.message ?? 'No se pudo cargar tu perfil de estudiante.';
        this.loadingProfile = false;
      },
    });
  }

  private _checkForosNuevos(): void {
    const lastSeenId = Number(localStorage.getItem('estudiante-foros-last-id') ?? '0');
    // Obtener foros y comparar con el último ID visto
    this.api.getForos().subscribe({
      next: (foros) => {
        const nuevos = foros.filter(f => f.id > lastSeenId).length;
        if (this.panelView() !== 'foros' && this.panelView() !== 'foro-detalle') {
          this.forosNuevos.set(nuevos);
        } else {
          this.forosNuevos.set(0);
          this.actualizarForoLastId(foros);
        }
      },
      error: () => {},
    });
  }

  marcarMensajesRecibidosComoLeidos(): void {
    const unread = this.mensajesRecibidos().filter((m) => m.estado !== 'leido');
    if (unread.length === 0) return;
    unread.forEach((m) => {
      this.api.marcarMensajeLeido(m.id).subscribe({
        next: () => {
          m.estado = 'leido';
          // Forzar refresco
          this.profile.set({ ...this.profile()! });
        },
      });
    });
  }

  /**
   * Calcula las insignias y el desglose de progreso por módulo
   * usando los datos reales del perfil (leccionesCompletadas x módulos del curso).
   */
  private calcularInsigniasYProgreso(perfil: EstudianteProfile): void {
    const completadasIds = new Set((perfil.leccionesCompletadas ?? []).map(l => l.id));
    const modulosDetalle: typeof this.progresoModulosDetalle extends { set: (v: infer T) => void } ? T : never[] = [];
    let totalLecciones = 0;
    let modulosCompletos = 0;

    for (const curso of perfil.cursos ?? []) {
      // No tenemos los módulos del curso en el perfil, así que usamos modulosBE si están cargados
      // En su defecto, el progreso global viene del servidor (perfil.progreso)
    }

    // Si hay módulos del backend cargados, usarlos para el desglose
    const modsBE = this.modulosBE();
    if (modsBE.length > 0) {
      for (const mod of modsBE) {
        const lecciones = mod.lecciones ?? [];
        const completadas = lecciones.filter(l => completadasIds.has(l.id));
        const pct = lecciones.length > 0
          ? Math.round((completadas.length / lecciones.length) * 100)
          : 0;
        totalLecciones += lecciones.length;
        if (pct >= 100) modulosCompletos++;
        modulosDetalle.push({
          moduloId: mod.id,
          moduloTitulo: mod.titulo,
          totalLecciones: lecciones.length,
          leccionesCompletadas: completadas.length,
          porcentaje: pct,
        });
      }
      this.progresoModulosDetalle.set(modulosDetalle);
    }

    const ctx: BadgeContext = {
      progresoGlobal: perfil.progreso ?? 0,
      leccionesCompletadas: completadasIds.size,
      totalLecciones: totalLecciones || 1,
      modulosCompletos,
      totalModulos: modsBE.length || (perfil.cursos?.length ?? 0),
      primeraLeccion: completadasIds.size > 0,
    };
    this.insignias.set(todasLasInsigniasConEstado(ctx));
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

  actualizarForoLastId(foros: ForoListItem[]): void {
    if (!foros || foros.length === 0) return;
    const maxId = foros.reduce((max, f) => f.id > max ? f.id : max, 0);
    const currentSeenId = Number(localStorage.getItem('estudiante-foros-last-id') ?? '0');
    if (maxId > currentSeenId) {
      localStorage.setItem('estudiante-foros-last-id', maxId.toString());
    }
  }

  loadForos(): void {
    if (this.foros().length) {
      this.actualizarForoLastId(this.foros());
      return;
    }
    this.forosLoading = true;
    this.forosError = null;
    this.api.getForos().subscribe({
      next: (rows) => {
        this.foros.set(rows);
        this.forosLoading = false;
        this.actualizarForoLastId(rows);
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
    this.storage.setItem(THEME_KEY, this.isDarkMode ? 'dark' : 'light');
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
    const perfil = this.profile();
    if (!perfil || !perfil.leccionesCompletadas) {
      return { done: 0, pct: 0 };
    }
    const completadasEnModulo = perfil.leccionesCompletadas.filter(
      (lc) => lc.modulo?.orden === mod.numero
    );
    const uniqueIds = new Set(completadasEnModulo.map(lc => lc.id));
    const done = Math.min(total, uniqueIds.size);
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
    const file = input.files?.[0];
    if (!file) return;
    input.value = '';

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Center-crop to square, then scale to 256×256
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(
          img,
          (img.width - size) / 2, (img.height - size) / 2, size, size,
          0, 0, 256, 256
        );

        this.avatarPreview = canvas.toDataURL('image/jpeg', 0.92);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const processed = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
          this.uploadAvatarFile(processed);
        }, 'image/jpeg', 0.92);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private uploadAvatarFile(file: File): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.avatarUploading = true;
    this.avatarUploadInfo = null;
    this.avatarUploadError = null;

    this.api.uploadAvatar(userId, file).subscribe({
      next: () => {
        this.avatarUploading = false;
        this.avatarUploadInfo = '¡Foto actualizada correctamente!';
        this.selectedAvatar = null;
        this.auth.checkAuthStatus().subscribe();
        this.loadProfile();
        setTimeout(() => { this.avatarUploadInfo = null; this.avatarPreview = null; }, 3000);
      },
      error: (err: { error?: { message?: string } }) => {
        this.avatarUploading = false;
        this.avatarUploadError = err?.error?.message ?? 'No se pudo subir la foto.';
        this.avatarPreview = null;
      },
    });
  }

  guardarPerfil(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.perfilSaving = true;
    this.perfilInfo = null;
    this.perfilErrorForm = null;

    this.api
      .updateUser(userId, {
        name: this.perfilForm.name,
        lastName: this.perfilForm.lastName,
        email: this.perfilForm.email,
      })
      .subscribe({
        next: () => this.finishPerfilSave(),
        error: (err) => this.failPerfil(err),
      });
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
    if (this.panelView() === 'leccion' && this.moduloPanelNum > 0) {
      this.router.navigate(['/estudiante/modulo-panel', this.moduloPanelNum]);
      return;
    }
    if (this.panelView() === 'modulo' && this.moduloPanelNum > 0) {
      this.router.navigate(['/estudiante/inicio']);
      return;
    }
    window.history.back();
  }

  private lessonStorageKey(moduloNum: number): string {
    return `modulo${moduloNum}_maxLesson`;
  }

  getMaxLessonCompleted(moduloNum: number): number {
    const raw = this.storage.getItem(this.lessonStorageKey(moduloNum));
    const n = parseInt(raw ?? '0', 10);
    return Number.isNaN(n) ? 0 : n;
  }

  /** Returns the TareaEntrega for the given module/lesson (0-based: prev lesson gates this one). */
  private entregaForPrevLesson(moduloNum: number, leccionOrden: number): TareaEntregaEstudiante | undefined {
    if (moduloNum <= 1 && leccionOrden <= 1) return undefined;
    
    let targetModuloNum = moduloNum;
    let targetLeccionOrden = leccionOrden - 1;

    if (leccionOrden <= 1) {
      targetModuloNum = moduloNum - 1;
      const prevModConfig = getModuloConfig(targetModuloNum);
      targetLeccionOrden = prevModConfig ? prevModConfig.totalLecciones : 0;
    }

    return (this.profile()?.tareasEntregas ?? []).find(
      (e) => e.tarea?.modulo?.orden === targetModuloNum && e.tarea?.leccion?.orden === targetLeccionOrden,
    );
  }

  isLeccionPanelUnlocked(moduloNum: number, leccionOrden: number): boolean {
    const gate = this.entregaForPrevLesson(moduloNum, leccionOrden);
    if (gate) {
      return gate.resultado === 'APROBADO';
    }
    
    if (moduloNum > 1 && leccionOrden === 1) {
      return false; // Prevent skipping modules if no delivery exists yet
    }
    
    const max = this.getMaxLessonCompleted(moduloNum);
    return leccionOrden <= max + 1;
  }

  isLeccionPendienteAprobacion(moduloNum: number, leccionOrden: number): boolean {
    const gate = this.entregaForPrevLesson(moduloNum, leccionOrden);
    // Only "pending" when student has actually submitted (entregado) but teacher hasn't reviewed yet
    return !!gate && gate.resultado === null && gate.estado === 'entregado';
  }

  isLeccionRechazada(moduloNum: number, leccionOrden: number): boolean {
    const gate = this.entregaForPrevLesson(moduloNum, leccionOrden);
    return !!gate && gate.resultado === 'NO_APROBADO';
  }

  markLeccionPanelComplete(moduloNum: number, leccionOrden: number): void {
    const max = this.getMaxLessonCompleted(moduloNum);
    if (leccionOrden > max) {
      this.storage.setItem(this.lessonStorageKey(moduloNum), String(leccionOrden));
    }
  }

  loadModuloPanel(num: number): void {
    this.moduloLoading = true;
    this.moduloActivoBE.set(null);
    const config = getModuloConfig(num);
    this.moduloActivo.set(config ?? null);
    this.moduloPanelNum = config ? num : 0;
    this.moduloLoading = false;
  }

  loadLeccionPanel(moduloNum: number, leccionOrden: number): void {
    this.leccionLoading = true;
    this.leccionPasoActual.set(0);
    this.moduloPanelNum = moduloNum;
    this.leccionPanelOrden = leccionOrden;

    const mod = getModuloConfig(moduloNum);
    const item = mod?.lecciones[leccionOrden - 1];
    const content = getLeccionContent(moduloNum, leccionOrden);

    this.leccionActiva.set({
      id: moduloNum * 100 + leccionOrden,
      titulo: item?.titulo ?? `Lección ${leccionOrden}`,
      descripcion: item?.descripcion ?? '',
      contenido: '',
      orden: String(leccionOrden),
    });
    this.leccionStaticContent.set(content ?? null);
    const firstPaso = content?.pasos[0];
    this.initEditorForStep(firstPaso);
    if (firstPaso?.paint) setTimeout(() => this.initPaint(), 50);
    this.leccionLoading = false;
  }

  onLeccionPanelClick(moduloNum: number, leccionOrden: number, event: Event): void {
    if (!this.isLeccionPanelUnlocked(moduloNum, leccionOrden)) {
      event.preventDefault();
    }
  }

  completarLeccionPanel(): void {
    if (this.moduloPanelNum > 0 && this.leccionPanelOrden > 0) {
      this.api.marcarTareaEntregada(this.moduloPanelNum, this.leccionPanelOrden).subscribe({
        next: (res: any) => {
          if (res?.success && res?.completed) {
            // Sin gate de docente: lección completada directamente
            this.markLeccionPanelComplete(this.moduloPanelNum, this.leccionPanelOrden);
            this.leccionCompletadaMsg = '¡Lección completada! Tu progreso ha sido guardado.';
            setTimeout(() => {
              this.leccionCompletadaMsg = '';
              this.loadProfile();
              this.goBack();
            }, 2000);
          } else if (res?.success) {
            // Gate de docente: mostrar mensaje de espera y recargar perfil al volver
            this.markLeccionPanelComplete(this.moduloPanelNum, this.leccionPanelOrden);
            this.leccionCompletadaMsg = '¡Lección completada! Tu trabajo ha sido enviado al docente para revisión. Podrás continuar una vez que sea aprobado.';
            setTimeout(() => {
              this.leccionCompletadaMsg = '';
              this.loadProfile();
              this.goBack();
            }, 3000);
          } else {
            // Mostrar error porque no existe en backend
            this.leccionCompletadaMsg = res?.message || 'Error: La lección no existe en la base de datos. El docente debe crearla primero.';
            setTimeout(() => {
              this.leccionCompletadaMsg = '';
              this.goBack();
            }, 3500);
          }
        },
        error: () => {
          this.goBack();
        },
      });
    } else {
      this.goBack();
    }
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
    if (this.leccionPasoActual() < max) {
      this.leccionPasoActual.update(v => v + 1);
      const newPaso = content.pasos[this.leccionPasoActual()];
      this.initEditorForStep(newPaso);
      if (newPaso.paint) setTimeout(() => this.initPaint(), 50);
    }
  }

  anteriorPaso(): void {
    const content = this.leccionStaticContent();
    if (this.leccionPasoActual() > 0) {
      this.leccionPasoActual.update(v => v - 1);
      const newPaso = content?.pasos[this.leccionPasoActual()];
      this.initEditorForStep(newPaso);
      if (newPaso?.paint) setTimeout(() => this.initPaint(), 50);
    }
  }

  private initEditorForStep(paso?: { editor?: EditorConfig; paint?: true }): void {
    this.editorMsg = '';
    this.editorSuccess = false;
    const box = document.getElementById(this.editorPreviewId);
    if (box) box.innerHTML = '';
    this.editorCode = paso?.editor?.startCode ?? '';
    this.paintCanvas = null;
    this.paintCtx = null;
  }

  resetEditor(): void {
    const content = this.leccionStaticContent();
    const paso = content?.pasos[this.leccionPasoActual()];
    this.editorMsg = '';
    this.editorSuccess = false;
    const box = document.getElementById(this.editorPreviewId);
    if (box) box.innerHTML = '';
    this.editorCode = paso?.editor?.startCode ?? '';
  }

  initPaint(): void {
    const canvas = document.getElementById('paint-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    this.paintCanvas = canvas;
    this.paintCtx = canvas.getContext('2d');
    if (!this.paintCtx) return;
    this.paintCtx.fillStyle = '#ffffff';
    this.paintCtx.fillRect(0, 0, canvas.width, canvas.height);
  }

  onPaintMouseDown(e: MouseEvent): void {
    if (!this.paintCtx || !this.paintCanvas) return;
    this.paintDrawing = true;
    const rect = this.paintCanvas.getBoundingClientRect();
    const scaleX = this.paintCanvas.width / rect.width;
    const scaleY = this.paintCanvas.height / rect.height;
    this.paintStartX = (e.clientX - rect.left) * scaleX;
    this.paintStartY = (e.clientY - rect.top) * scaleY;
    if (this.paintTool !== 'pencil' && this.paintTool !== 'eraser') {
      this.paintSnapshot = this.paintCtx.getImageData(0, 0, this.paintCanvas.width, this.paintCanvas.height);
    } else {
      this.paintCtx.beginPath();
      this.paintCtx.moveTo(this.paintStartX, this.paintStartY);
    }
  }

  onPaintMouseMove(e: MouseEvent): void {
    if (!this.paintDrawing || !this.paintCtx || !this.paintCanvas) return;
    const rect = this.paintCanvas.getBoundingClientRect();
    const scaleX = this.paintCanvas.width / rect.width;
    const scaleY = this.paintCanvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    this.paintCtx.lineWidth = this.paintSize;
    this.paintCtx.lineCap = 'round';
    this.paintCtx.lineJoin = 'round';
    if (this.paintTool === 'pencil') {
      this.paintCtx.strokeStyle = this.paintColor;
      this.paintCtx.lineTo(x, y);
      this.paintCtx.stroke();
    } else if (this.paintTool === 'eraser') {
      this.paintCtx.strokeStyle = '#ffffff';
      this.paintCtx.lineTo(x, y);
      this.paintCtx.stroke();
    } else if (this.paintSnapshot) {
      this.paintCtx.putImageData(this.paintSnapshot, 0, 0);
      this.paintCtx.strokeStyle = this.paintColor;
      this.paintCtx.beginPath();
      if (this.paintTool === 'rect') {
        this.paintCtx.strokeRect(this.paintStartX, this.paintStartY, x - this.paintStartX, y - this.paintStartY);
      } else if (this.paintTool === 'circle') {
        const rx = Math.abs(x - this.paintStartX) / 2;
        const ry = Math.abs(y - this.paintStartY) / 2;
        const cx = this.paintStartX + (x - this.paintStartX) / 2;
        const cy = this.paintStartY + (y - this.paintStartY) / 2;
        this.paintCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        this.paintCtx.stroke();
      } else if (this.paintTool === 'line') {
        this.paintCtx.moveTo(this.paintStartX, this.paintStartY);
        this.paintCtx.lineTo(x, y);
        this.paintCtx.stroke();
      }
    }
  }

  onPaintMouseUp(): void {
    this.paintDrawing = false;
    this.paintSnapshot = null;
  }

  clearPaintCanvas(): void {
    if (!this.paintCtx || !this.paintCanvas) return;
    this.paintCtx.fillStyle = '#ffffff';
    this.paintCtx.fillRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
  }

  downloadPaintCanvas(): void {
    if (!this.paintCanvas) return;
    const link = document.createElement('a');
    link.download = 'mi-pagina-web.png';
    link.href = this.paintCanvas.toDataURL('image/png');
    link.click();
  }

  runCode(editor: EditorConfig): void {
    const code = this.editorCode.trim();
    this.editorMsg = '';
    this.editorSuccess = false;
    const box = document.getElementById(this.editorPreviewId);
    if (box) box.innerHTML = '';

    if (!code) {
      this.editorMsg = 'Escribe algo de código primero.';
      return;
    }

    const valid = this.validateCode(editor.validator, code);
    if (!valid) {
      this.editorMsg = editor.errorMsg;
      return;
    }

    this.editorSuccess = true;
    this.editorMsg = editor.validMsg;

    if (box) {
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '260px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      box.appendChild(iframe);
      const doc = iframe.contentWindow!.document;
      doc.open();
      doc.write(code);
      doc.close();
    }
  }

  private validateCode(validator: EditorConfig['validator'], html: string): boolean {
    const h = html.toLowerCase();
    const count = (tag: string) => (h.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
    switch (validator) {
      case 'basic-html':
        return h.includes('<!doctype html') && h.includes('<html') && h.includes('</html>') &&
               h.includes('<head') && h.includes('</head>') && h.includes('<body') &&
               h.includes('</body>') && h.includes('<h1') && h.includes('</h1>') &&
               h.includes('<p') && h.includes('</p>');
      case 'titles-paragraphs':
        return (count('h1') + count('h2') + count('h3')) >= 3 && count('p') >= 3;
      case 'images':
        return (h.match(/<img[\s\S]*?>/g) || []).length >= 3;
      case 'lists': {
        const ulBlocks = h.match(/<ul[\s\S]*?<\/ul>/g) || [];
        const olBlocks = h.match(/<ol[\s\S]*?<\/ol>/g) || [];
        const liIn = (blocks: string[]) => blocks.reduce((n, b) => n + (b.match(/<li[\s>]/g) || []).length, 0);
        return ulBlocks.length >= 1 && olBlocks.length >= 1 && liIn(ulBlocks) >= 3 && liIn(olBlocks) >= 3;
      }
      case 'links':
        return (h.match(/<a[\s\S]*?href=["'][^"']+["'][\s\S]*?>[\s\S]*?<\/a>/g) || []).length >= 4;
      case 'table':
        return h.includes('<table') && h.includes('</table>') && (h.match(/<tr[\s>]/g) || []).length >= 4;
      case 'form':
        return h.includes('<form') && h.includes('</form>') && count('label') >= 2 &&
               count('input') >= 2 && count('button') >= 1;
      case 'full-page':
        return h.includes('<h1') && h.includes('</h1>') && h.includes('<p') &&
               (h.match(/<img[\s\S]*?src=["'][^"']+["'][\s\S]*?alt=["'][^"']*["'][\s\S]*?>/g) || []).length >= 1 &&
               (h.match(/<a[\s\S]*?href=["'][^"']+["'][\s\S]*?>[\s\S]*?<\/a>/g) || []).length >= 1;
      case 'css-basic':
        return h.includes('<style') && h.includes('background-color') &&
               h.includes('color') && h.includes('font-family');
      case 'css-gradient':
        return h.includes('<style') &&
               (h.includes('linear-gradient') || h.includes('radial-gradient')) &&
               (h.match(/color\s*:/g) || []).length >= 2;
      case 'css-typography':
        return h.includes('<style') && h.includes('font-size') &&
               h.includes('font-family') && (h.includes('font-weight') || h.includes('text-align'));
      case 'css-box-model':
        return h.includes('<style') && h.includes('border') &&
               h.includes('border-radius') && h.includes('padding') && h.includes('box-shadow');
      case 'css-lists-tables':
        return h.includes('<style') &&
               (h.includes('list-style') || h.includes('border-collapse')) &&
               (h.includes('li') || h.includes('table'));
      default: return true;
    }
  }

  formatFecha(value: string | Date | undefined): string {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('es-CO');
  }

  responderForo(foroId: number): void {
    if (!this.nuevaRespuestaForo.trim()) return;
    const estId = this.profile()?.id;
    if (!estId) return;

    this.enviandoRespuestaForo = true;
    
    this.api.responderForo(foroId, { contenido: this.nuevaRespuestaForo, estudianteId: estId }).subscribe({
      next: () => {
        this.enviandoRespuestaForo = false;
        this.nuevaRespuestaForo = '';
        this.loadForoDetalle(foroId); // Recargar foro para ver la respuesta
      },
      error: (err) => {
        this.enviandoRespuestaForo = false;
        console.error('Error al responder foro:', err);
      }
    });
  }

  responderBandeja(mensajeId: number): void {
    const contenido = this.respuestasBandeja[mensajeId];
    if (!contenido || !contenido.trim()) return;
    
    const estId = this.profile()?.id;
    // Buscamos el mensaje original para saber a qué docente responder
    const msgOriginal = this.profile()?.mensajes?.find(m => m.id === mensajeId);
    const docId = msgOriginal?.docente?.id;

    if (!estId || !docId) return;

    this.enviandoRespuestaBandeja[mensajeId] = true;
    
    this.api.enviarMensaje({
      contenido,
      estudianteId: estId,
      docenteId: docId,
      remitenteTipo: 'estudiante'
    }).subscribe({
      next: () => {
        this.enviandoRespuestaBandeja[mensajeId] = false;
        this.respuestasBandeja[mensajeId] = '';
        this.loadProfile(); // Recargar el perfil para actualizar la bandeja
      },
      error: (err) => {
        this.enviandoRespuestaBandeja[mensajeId] = false;
        console.error('Error al enviar mensaje:', err);
      }
    });
  }

  getAutorNombre(r: any): string {
    if (r.estudiante?.user) {
      const u = r.estudiante.user;
      return [u.name, u.lastName].filter(Boolean).join(' ') || 'Estudiante';
    }
    if (r.docente?.user) {
      const u = r.docente.user;
      return [u.name, u.lastName].filter(Boolean).join(' ') || 'Docente';
    }
    return 'Usuario';
  }

  marcarComoCompletada(leccionId: number) {
    this.api.marcarLeccionCompletada(leccionId).subscribe({
      next: () => {
        this.loadProfile(); // Actualiza el progreso
        alert('Lección completada con éxito!');
      },
      error: (err) => console.error(err)
    });
  }
}

