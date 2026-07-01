import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Auth } from '../../services/auth';
import { DocenteApiService, type CursoDocente, type CursoDetalleDocente, type DocenteForo, type DocenteMensaje, type DocenteEstudiante, type DocenteTarea, type TareaEntrega, type ForoRespuesta, type EstudianteProgresoDetalle } from '../../services/docente-api.service';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';
import { ProgressWsService } from '../../services/progress-ws.service';
import { LayoutDashboard, BookOpen, LogOut, ClipboardList, MessageSquare, Mail, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-angular';

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

  readonly userAvatar = computed(() => {
    const avatar = this.authService.currentUser()?.avatar;
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    // Normalize: remove leading slash and build full URL
    const normalized = avatar.replace(/^\//, '');
    return `http://localhost:3000/${normalized}`;
  });

  perfilError: string | null = null;
  uploadError: string | null = null;
  selectedFile: File | null = null;
  uploadSuccess = false;

  readonly misCursosSig = signal<CursoDocente[]>([]);
  readonly cursosDetalleSig = signal<Map<number, CursoDetalleDocente>>(new Map());
  cursosLoading = false;
  cursosDetalleLoading = false;
  cursosError: string | null = null;

  readonly forosSig = signal<DocenteForo[]>([]);
  forosLoading = false;

  readonly mensajesEnviadosSig = signal<DocenteMensaje[]>([]);
  readonly mensajesRecibidosSig = signal<DocenteMensaje[]>([]);
  mensajesLoading = false;

  readonly estudiantesSig = signal<DocenteEstudiante[]>([]);

  // Tareas functional state
  readonly tareasSig = signal<DocenteTarea[]>([]);
  tareasLoading = false;
  tareasError: string | null = null;
  calificando = signal<Set<number>>(new Set());

  // Foros thread detail state
  readonly selectedForoId = signal<number | null>(null);
  readonly selectedForoSig = signal<DocenteForo | null>(null);
  readonly foroRespuestasSig = signal<ForoRespuesta[]>([]);
  foroRespuestasLoading = false;
  nuevaRespuestaContenido = '';
  editandoRespuestaId: number | null = null;
  editandoRespuestaContenido = '';
  foroDetalleError: string | null = null;
  calificarError: string | null = null;

  readonly dashboardStatsSig = signal<{ totalEstudiantes: number; totalCursosActivos: number; tasaCompletacion: number } | null>(null);

  readonly misStats = computed(() => {
    const stats = this.dashboardStatsSig();
    if (stats) {
      return {
        totalCursos: this.misCursosSig().length > 0 ? this.misCursosSig().length : stats.totalCursosActivos, // Backend doesn't return total inactive + active courses directly in stats, so we rely on misCursos if loaded, or active
        cursosActivos: stats.totalCursosActivos,
        totalEstudiantes: stats.totalEstudiantes,
      };
    }
    // Fallback si no hay stats cargados aún
    const mis = this.misCursosSig();
    const studentIds = new Set<number>();
    mis.forEach(c => {
      if (Array.isArray(c.estudiantes)) {
        c.estudiantes.forEach(e => studentIds.add(e.id));
      }
    });
    return {
      totalCursos: mis.length,
      cursosActivos: mis.filter((c) => c.estado).length,
      totalEstudiantes: studentIds.size,
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
  protected readonly iChevDown = ChevronDown;
  protected readonly iChevUp = ChevronUp;

  // === ESTUDIANTES: Estado de progreso y WebSocket ===
  private readonly progressWs = inject(ProgressWsService);
  private wsSub?: Subscription;

  readonly estudiantesListaSig = signal<DocenteEstudiante[]>([]);
  estudiantesListaLoading = false;

  // Sort y filtro
  sortCampo = signal<'nombre' | 'progreso' | 'estado'>('nombre');
  sortAsc = signal(true);
  filtroEstado = signal<'todos' | 'en_riesgo' | 'en_progreso' | 'completado'>('todos');
  busquedaEstudiante = '';

  // Drill-down de estudiante seleccionado
  readonly estudianteDetalleId = signal<number | null>(null);
  readonly estudianteDetalle = signal<EstudianteProgresoDetalle | null>(null);
  estudianteDetalleLoading = false;
  estudianteDetalleError: string | null = null;

  /** Lista filtrada y ordenada de estudiantes */
  readonly estudiantesFiltrados = computed(() => {
    let lista = this.estudiantesListaSig();

    // Filtrar por búsqueda
    const q = this.busquedaEstudiante.toLowerCase();
    if (q) {
      lista = lista.filter(
        (e) =>
          e.nombre.toLowerCase().includes(q) ||
          e.apellido.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q),
      );
    }

    // Filtrar por estado de progreso
    const filtro = this.filtroEstado();
    if (filtro !== 'todos') {
      lista = lista.filter((e) => {
        if (filtro === 'en_riesgo') return e.progreso < 25;
        if (filtro === 'en_progreso') return e.progreso >= 25 && e.progreso < 100;
        if (filtro === 'completado') return e.progreso >= 100;
        return true;
      });
    }

    // Ordenar
    const campo = this.sortCampo();
    const asc = this.sortAsc();
    lista = [...lista].sort((a, b) => {
      let cmp = 0;
      if (campo === 'nombre') cmp = `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`);
      else if (campo === 'progreso') cmp = (a.progreso ?? 0) - (b.progreso ?? 0);
      else if (campo === 'estado') cmp = this.estadoProgresoOrden(a.progreso) - this.estadoProgresoOrden(b.progreso);
      return asc ? cmp : -cmp;
    });

    return lista;
  });

  private estadoProgresoOrden(pct: number): number {
    if (pct < 25) return 0;   // en riesgo
    if (pct < 100) return 1;  // en progreso
    return 2;                 // completado
  }

  estadoProgresoLabel(pct: number): string {
    if (pct >= 100) return 'Completado';
    if (pct >= 25) return 'En progreso';
    return 'En riesgo';
  }

  estadoProgresoClass(pct: number): string {
    if (pct >= 100) return 'badge--completado';
    if (pct >= 25) return 'badge--en-progreso';
    return 'badge--en-riesgo';
  }

  toggleSort(campo: 'nombre' | 'progreso' | 'estado'): void {
    if (this.sortCampo() === campo) {
      this.sortAsc.update((v) => !v);
    } else {
      this.sortCampo.set(campo);
      this.sortAsc.set(true);
    }
  }

  loadEstudiantes(): void {
    this.estudiantesListaLoading = true;
    this.docenteApi.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantesListaSig.set(data);
        this.estudiantesListaLoading = false;
        // Suscribir a WebSocket para cada curso del docente
        this.subscribeWsCursos();
      },
      error: () => {
        this.estudiantesListaLoading = false;
      },
    });
  }

  private subscribeWsCursos(): void {
    // Limpiar suscripción previa
    this.wsSub?.unsubscribe();
    // Unirse a las salas de todos los cursos del docente
    for (const curso of this.misCursosSig()) {
      this.progressWs.joinCurso(curso.id);
    }
    // Escuchar eventos de progreso
    this.wsSub = this.progressWs.progreso$.subscribe((event) => {
      // Actualizar progreso del estudiante en la lista
      this.estudiantesListaSig.update((lista) =>
        lista.map((est) =>
          est.id === event.estudianteId
            ? { ...est, progreso: event.progreso }
            : est,
        ),
      );
      // Si el estudiante está en el panel de detalle, recargar
      if (this.estudianteDetalleId() === event.estudianteId) {
        this.loadEstudianteDetalle(event.estudianteId);
      }
    });
  }

  loadEstudianteDetalle(estudianteId: number): void {
    this.estudianteDetalleId.set(estudianteId);
    this.estudianteDetalleLoading = true;
    this.estudianteDetalleError = null;
    this.docenteApi.getEstudianteProgreso(estudianteId).subscribe({
      next: (detalle) => {
        this.estudianteDetalle.set(detalle);
        this.estudianteDetalleLoading = false;
      },
      error: () => {
        this.estudianteDetalleError = 'No se pudo cargar el detalle del estudiante.';
        this.estudianteDetalleLoading = false;
      },
    });
  }

  cerrarDetalle(): void {
    this.estudianteDetalleId.set(null);
    this.estudianteDetalle.set(null);
    this.estudianteDetalleError = null;
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
    this.progressWs.disconnect();
  }

  private _refreshMensajesNoLeidos(): void {
    this.docenteApi.getMensajesRecibidosCount().subscribe({
      next: (count) => this.mensajesNoLeidosSig.set(count),
      error: () => {},
    });
  }

  // Mensajes state
  activeTabMensajes: 'enviar' | 'enviados' | 'recibidos' = 'enviar';
  msgDestinatarioId = 0;
  msgContenido = '';
  msgSendingDocente = false;
  msgInfoDocente: string | null = null;
  msgErrorDocente: string | null = null;

  cambiarTabMensajes(tab: 'enviar' | 'enviados' | 'recibidos'): void {
    this.activeTabMensajes = tab;
    if (tab === 'recibidos') {
      this.marcarMensajesRecibidosComoLeidos();
    }
  }

  marcarMensajesRecibidosComoLeidos(): void {
    const unread = this.mensajesRecibidosSig().filter(m => !m.leido);
    if (unread.length === 0) return;
    unread.forEach(m => {
      this.docenteApi.marcarMensajeLeido(m.id).subscribe({
        next: () => {
          m.leido = true;
          // Disminuir o resetear contador
          const count = this.mensajesRecibidosSig().filter(msg => !msg.leido).length;
          this.mensajesNoLeidosSig.set(count);
        }
      });
    });
  }

  // Foros state
  foroTitulo = '';
  foroCursoId = 0;
  foroDescripcion = '';
  foroSending = false;
  foroInfo: string | null = null;
  foroError: string | null = null;

  // === EDITAR FORO ===
  editandoForoId: number | null = null;
  editandoForoTitulo = '';
  editandoForoDescripcion = '';
  editandoForoGuardando = false;
  editandoForoError: string | null = null;

  // === BADGE DE MENSAJES NO LEÍDOS ===
  readonly mensajesNoLeidosSig = signal(0);

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
    // Cargar conteo de mensajes no leídos para mostrar badge en el nav
    this._refreshMensajesNoLeidos();
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
    if (path.includes('/docente/estudiantes')) return 'mis-cursos'; // redirige al unificado
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

    // Reset forum selection by default
    this.selectedForoId.set(null);
    this.selectedForoSig.set(null);
    this.foroRespuestasSig.set([]);

    if (view === 'dashboard' || view === 'tareas' || view === 'foros') {
      this.loadCursos();
    }
    if (view === 'dashboard') {
      this.docenteApi.getDashboardStats().subscribe({
        next: (stats) => this.dashboardStatsSig.set(stats),
        error: () => {},
      });
    }
    if (view === 'mis-cursos') {
      this.loadCursos();
      this.loadEstudiantes();
    }
    if (view === 'tareas') {
      this.loadTareas();
    }
    if (view === 'foros') {
      this.loadForos();
      const forumMatch = path.match(/\/docente\/foros\/(\d+)/);
      if (forumMatch) {
        const foroId = parseInt(forumMatch[1], 10);
        this.selectedForoId.set(foroId);
        this.loadForoDetalle(foroId);
      }
    }
    if (view === 'mensajes') {
      this.loadMensajes();
      this.mensajesNoLeidosSig.set(0); // Limpia badge al abrir mensajes
      localStorage.setItem('docente-mensajes-last-seen', Date.now().toString());
      this.docenteApi.getEstudiantes().subscribe({
        next: (data) => this.estudiantesSig.set(data),
        error: () => {},
      });
    }
  }

  loadCursos(): void {
    this.cursosLoading = true;
    this.cursosError = null;
    this.docenteApi.getCursos().subscribe({
      next: (rows) => {
        this.misCursosSig.set(rows);
        this.cursosLoading = false;
        // Cargar detalle de cada curso (estudiantes por curso)
        this.cursosDetalleSig.set(new Map());
        this.cursosDetalleLoading = true;
        let pending = rows.length;
        if (pending === 0) { this.cursosDetalleLoading = false; return; }
        for (const curso of rows) {
          this.docenteApi.getCursoDetalle(curso.id).subscribe({
            next: (det) => {
              const m = new Map(this.cursosDetalleSig());
              m.set(curso.id, det);
              this.cursosDetalleSig.set(m);
              if (--pending === 0) this.cursosDetalleLoading = false;
            },
            error: () => { if (--pending === 0) this.cursosDetalleLoading = false; },
          });
        }
      },
      error: () => {
        this.cursosError = 'No se pudieron cargar los cursos.';
        this.cursosLoading = false;
      },
    });
  }

  getCursoDetalle(cursoId: number) {
    return this.cursosDetalleSig().get(cursoId);
  }

  getEstadoProgresoClass(pct: number): string {
    if (pct >= 100) return 'est-prog-completo';
    if (pct >= 25) return 'est-prog-medio';
    return 'est-prog-bajo';
  }

  get misCursosFiltered(): CursoDocente[] {
    return this.misCursosSig();
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
    this.uploadError = null;
    this.uploadSuccess = false;
    const file = this.selectedFile;
    this.docenteApi.uploadFotoPerfil(file).subscribe({
      next: (res: any) => {
        this.uploadSuccess = true;
        this.selectedFile = null;
        const url: string | undefined = res?.fotoPerfil?.url;
        if (url) {
          // Normalize: remove leading slash for consistency, then build full URL
          const normalized = url.replace(/^\//, '');
          const fullUrl = normalized.startsWith('uploads/')
            ? `http://localhost:3000/${normalized}`
            : `http://localhost:3000${url}`;
          this.authService.patchAvatar(fullUrl);
        }
        setTimeout(() => { this.uploadSuccess = false; }, 4000);
      },
      error: (err: any) => {
        this.uploadError = err?.error?.message ?? 'Error al subir la imagen. Intenta de nuevo.';
      },
    });
  }

  loadForos(): void {
    this.forosLoading = true;
    this.docenteApi.getForos().subscribe({
      next: (foros) => {
        this.forosSig.set(foros);
        this.forosLoading = false;
      },
      error: () => {
        this.forosLoading = false;
      },
    });
  }

  forosPorCurso(cursoId: number): DocenteForo[] {
    return this.forosSig().filter((f) => f.cursoId === cursoId);
  }

  crearForo(): void {
    if (!this.foroTitulo || !this.foroCursoId || !this.foroDescripcion) return;
    this.foroSending = true;
    this.foroInfo = null;
    this.foroError = null;
    this.docenteApi.createForo({ titulo: this.foroTitulo, descripcion: this.foroDescripcion, cursoId: this.foroCursoId }).subscribe({
      next: () => {
        this.foroInfo = 'Foro creado exitosamente.';
        this.foroTitulo = '';
        this.foroCursoId = 0;
        this.foroDescripcion = '';
        this.foroSending = false;
        this.loadForos();
        setTimeout(() => { this.foroInfo = null; }, 4000);
      },
      error: (err: any) => {
        this.foroError =
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          'Error al crear el foro. Verifica que el curso esté seleccionado correctamente.';
        this.foroSending = false;
      },
    });
  }

  iniciarEdicionForo(foro: DocenteForo): void {
    this.editandoForoId = foro.id;
    this.editandoForoTitulo = foro.titulo;
    this.editandoForoDescripcion = foro.descripcion ?? '';
    this.editandoForoError = null;
  }

  cancelarEdicionForo(): void {
    this.editandoForoId = null;
    this.editandoForoTitulo = '';
    this.editandoForoDescripcion = '';
    this.editandoForoError = null;
  }

  guardarEdicionForo(): void {
    const id = this.editandoForoId;
    if (!id || !this.editandoForoTitulo.trim() || !this.editandoForoDescripcion.trim()) return;
    this.editandoForoGuardando = true;
    this.editandoForoError = null;
    this.docenteApi.updateForo(id, {
      titulo: this.editandoForoTitulo.trim(),
      descripcion: this.editandoForoDescripcion.trim(),
    }).subscribe({
      next: () => {
        this.editandoForoGuardando = false;
        this.cancelarEdicionForo();
        this.foroInfo = 'Foro actualizado correctamente.';
        this.loadForos();
        setTimeout(() => { this.foroInfo = null; }, 3500);
      },
      error: (err: any) => {
        this.editandoForoGuardando = false;
        this.editandoForoError =
          err?.error?.message ??
          'No se pudo guardar el foro. Intenta de nuevo.';
      },
    });
  }

  eliminarForo(foroId: number): void {
    this.docenteApi.deleteForo(foroId).subscribe({
      next: () => {
        this.forosSig.update((list) => list.filter((f) => f.id !== foroId));
      },
      error: () => {
        this.foroError = 'Error al eliminar el foro.';
      },
    });
  }

  loadMensajes(): void {
    this.mensajesLoading = true;
    forkJoin({
      enviados: this.docenteApi.getMensajesEnviados(),
      recibidos: this.docenteApi.getMensajesRecibidos(),
    }).subscribe({
      next: ({ enviados, recibidos }) => {
        this.mensajesEnviadosSig.set(enviados ?? []);
        this.mensajesRecibidosSig.set(recibidos ?? []);
        this.mensajesLoading = false;
        if (this.activeTabMensajes === 'recibidos') {
          this.marcarMensajesRecibidosComoLeidos();
        }
      },
      error: () => { this.mensajesLoading = false; },
    });
  }

  enviarMensajeDocente(): void {
    if (!this.msgDestinatarioId || !this.msgContenido) return;
    this.msgSendingDocente = true;
    this.msgInfoDocente = null;
    this.msgErrorDocente = null;
    this.docenteApi.sendMensaje({ destinatarioId: this.msgDestinatarioId, contenido: this.msgContenido }).subscribe({
      next: () => {
        this.msgInfoDocente = 'Mensaje enviado correctamente.';
        this.msgContenido = '';
        this.msgDestinatarioId = 0;
        this.msgSendingDocente = false;
        this.loadMensajes();
      },
      error: () => {
        this.msgErrorDocente = 'Error al enviar el mensaje. Intenta de nuevo.';
        this.msgSendingDocente = false;
      },
    });
  }

  loadTareas(): void {
    this.tareasLoading = true;
    this.tareasError = null;
    this.docenteApi.getTareas().subscribe({
      next: (tareas) => {
        this.tareasSig.set(tareas);
        this.tareasLoading = false;
      },
      error: (err) => {
        this.tareasError = err?.status === 401 || err?.status === 403
          ? 'Sin acceso: verifica que tu cuenta tenga perfil de docente activo.'
          : 'Error al cargar las tareas. Recarga la página.';
        this.tareasLoading = false;
      },
    });
  }

  get cursosConTareas() {
    const map = new Map<number, { id: number; nombre: string; tareas: DocenteTarea[] }>();
    for (const t of this.tareasSig()) {
      const cId = t.cursoId || 0;
      if (!map.has(cId)) {
        map.set(cId, { id: cId, nombre: t.cursoNombre || 'Curso', tareas: [] });
      }
      map.get(cId)!.tareas.push(t);
    }
    return Array.from(map.values());
  }

  isCalificando(entregaId: number): boolean {
    return this.calificando().has(entregaId);
  }

  calificarTarea(entregaId: number, resultado: 'APROBADO' | 'NO_APROBADO'): void {
    this.calificarError = null;
    const loading = new Set(this.calificando());
    loading.add(entregaId);
    this.calificando.set(loading);

    this.docenteApi.calificarTarea(entregaId, resultado).subscribe({
      next: () => {
        const l = new Set(this.calificando());
        l.delete(entregaId);
        this.calificando.set(l);
        // Recargar tareas y detalles de cursos para reflejar el progreso actualizado
        this.loadTareas();
        this.loadCursos();
        if (this.estudianteDetalleId()) {
          this.loadEstudianteDetalle(this.estudianteDetalleId()!);
        }
      },
      error: (err: any) => {
        const l = new Set(this.calificando());
        l.delete(entregaId);
        this.calificando.set(l);
        this.calificarError =
          err?.error?.message ??
          'No se pudo calificar la entrega. Intenta de nuevo.';
      },
    });
  }

  loadForoDetalle(foroId: number): void {
    this.foroRespuestasLoading = true;
    this.docenteApi.getForoById(foroId).subscribe({
      next: (foro) => {
        this.selectedForoSig.set(foro);
      },
      error: () => {
        this.selectedForoSig.set(null);
      }
    });

    this.docenteApi.getForoRespuestas(foroId).subscribe({
      next: (respuestas) => {
        this.foroRespuestasSig.set(respuestas);
        this.foroRespuestasLoading = false;
      },
      error: () => {
        this.foroRespuestasLoading = false;
      }
    });
  }

  publicarRespuesta(): void {
    const foroId = this.selectedForoId();
    if (!foroId || !this.nuevaRespuestaContenido.trim()) return;
    this.foroDetalleError = null;

    const docenteId = this.authService.currentUser()?.docente?.id ?? 0;
    this.docenteApi.responderForo(foroId, { contenido: this.nuevaRespuestaContenido, docenteId })
      .subscribe({
        next: () => {
          this.nuevaRespuestaContenido = '';
          this.loadForoDetalle(foroId);
        },
        error: () => {
          this.foroDetalleError = 'No se pudo publicar la respuesta. Intenta de nuevo.';
        },
      });
  }

  eliminarRespuesta(respuestaId: number): void {
    const foroId = this.selectedForoId();
    if (!foroId || !confirm('¿Eliminar esta respuesta?')) return;
    this.foroDetalleError = null;

    this.docenteApi.deleteForoRespuesta(respuestaId).subscribe({
      next: () => { this.loadForoDetalle(foroId); },
      error: () => {
        this.foroDetalleError = 'No se pudo eliminar la respuesta.';
      },
    });
  }

  iniciarEdicion(respuesta: ForoRespuesta): void {
    this.editandoRespuestaId = respuesta.id;
    this.editandoRespuestaContenido = respuesta.mensaje;
    this.foroDetalleError = null;
  }

  guardarEdicion(): void {
    const foroId = this.selectedForoId();
    const respId = this.editandoRespuestaId;
    if (!foroId || !respId || !this.editandoRespuestaContenido.trim()) return;
    this.foroDetalleError = null;

    this.docenteApi.updateForoRespuesta(respId, { contenido: this.editandoRespuestaContenido })
      .subscribe({
        next: () => {
          this.cancelarEdicion();
          this.loadForoDetalle(foroId);
        },
        error: () => {
          this.foroDetalleError = 'No se pudo guardar la edición.';
        },
      });
  }

  cancelarEdicion(): void {
    this.editandoRespuestaId = null;
    this.editandoRespuestaContenido = '';
  }
}
