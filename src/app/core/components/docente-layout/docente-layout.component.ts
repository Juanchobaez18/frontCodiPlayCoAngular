import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Auth } from '../../services/auth';
import { DocenteApiService, type CursoDocente, type DocenteForo, type DocenteMensaje, type DocenteEstudiante, type DocenteTarea, type TareaEntrega, type ForoRespuesta } from '../../services/docente-api.service';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';
import { MisCursosComponent } from '../../../features/docente/mis-cursos/mis-cursos.component';
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
    MisCursosComponent,
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

  readonly userAvatar = computed(() => this.authService.currentUser()?.avatar ?? null);

  perfilError: string | null = null;
  uploadError: string | null = null;
  selectedFile: File | null = null;
  uploadSuccess = false;

  readonly misCursosSig = signal<CursoDocente[]>([]);
  cursosLoading = false;
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

    // Reset forum selection by default
    this.selectedForoId.set(null);
    this.selectedForoSig.set(null);
    this.foroRespuestasSig.set([]);

    if (view === 'dashboard' || view === 'mis-cursos' || view === 'tareas' || view === 'foros') {
      this.loadCursos();
    }
    if (view === 'tareas') {
      this.loadTareas();
    }
    if (view === 'foros') {
      this.loadForos();
      // Check if it's a specific forum detail
      const forumMatch = path.match(/\/docente\/foros\/(\d+)/);
      if (forumMatch) {
        const foroId = parseInt(forumMatch[1], 10);
        this.selectedForoId.set(foroId);
        this.loadForoDetalle(foroId);
      }
    }
    if (view === 'mensajes') {
      this.loadMensajes();
      this.loadEstudiantes();
    }
  }

  loadCursos(): void {
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
    this.uploadError = null;
    this.uploadSuccess = false;
    const file = this.selectedFile;
    this.docenteApi.uploadFotoPerfil(file).subscribe({
      next: (res: any) => {
        this.uploadSuccess = true;
        this.selectedFile = null;
        const url: string | undefined = res?.fotoPerfil?.url;
        if (url) {
          this.authService.patchAvatar(`https://codiplayconest.onrender.com${url}`);
        }
      },
      error: () => {
        this.uploadError = 'Error al subir la imagen. Intenta de nuevo.';
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
      },
      error: () => {
        this.foroError = 'Error al crear el foro. Intenta de nuevo.';
        this.foroSending = false;
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
      },
      error: () => { this.mensajesLoading = false; },
    });
  }

  loadEstudiantes(): void {
    this.docenteApi.getEstudiantes().subscribe({
      next: (data) => this.estudiantesSig.set(data),
      error: () => {},
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
        this.loadTareas();
      },
      error: () => {
        const l = new Set(this.calificando());
        l.delete(entregaId);
        this.calificando.set(l);
        this.calificarError = 'No se pudo calificar la entrega. Intenta de nuevo.';
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

