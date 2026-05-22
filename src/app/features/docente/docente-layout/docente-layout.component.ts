import { Component, DestroyRef, OnInit, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Auth } from '../../../core/services/auth';
import { userHasDocentePanelAccess } from '../../../core/config/docente-panel-access.config';
import { DashboardLayoutComponent } from '../../../core/components/dashboard-layout/dashboard-layout.component';
import { DocenteSidebarComponent } from './docente-sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MisCursosComponent } from '../mis-cursos/mis-cursos.component';
import { EstudiantesComponent } from '../estudiantes/estudiantes.component';
import { TareasComponent } from '../tareas/tareas.component';
import { MensajesComponent } from '../mensajes/mensajes.component';
import { ForosComponent } from '../foros/foros.component';
import { ForoDetalleComponent } from '../foro-detalle/foro-detalle.component';

export type DocentePanelView =
  | 'dashboard'
  | 'mis-cursos'
  | 'estudiantes'
  | 'tareas'
  | 'mensajes'
  | 'foros'
  | 'foro-detalle'
  | null;

const THEME_STORAGE_KEY = 'codipayco-docente-theme';

@Component({
  selector: 'app-docente-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    DashboardLayoutComponent,
    DocenteSidebarComponent,
    DashboardComponent,
    MisCursosComponent,
    EstudiantesComponent,
    TareasComponent,
    MensajesComponent,
    ForosComponent,
    ForoDetalleComponent,
  ],
  templateUrl: './docente-layout.component.html',
  styleUrl: './docente-layout.component.scss',
})
export class DocenteLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  public authService = inject(Auth);

  docentePanelView = signal<DocentePanelView>('dashboard');
  readonly isDarkMode = signal(false);

  readonly userDisplayName = computed(() => {
    const u = this.authService.currentUser();
    const full = [u?.name, u?.lastName]
      .map((s) => s?.trim())
      .filter((s): s is string => !!s && s.length > 0)
      .join(' ');
    return full.length > 0 ? full : 'Docente';
  });

  readonly userEmail = computed(() => {
    return this.authService.currentUser()?.email?.trim() ?? '';
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.updateViewFromRoute(e.urlAfterRedirects));
  }

  ngOnInit(): void {
    if (!userHasDocentePanelAccess(this.authService.currentUser())) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    this.isDarkMode.set(saved === 'dark');
    document.body.classList.toggle('dark', saved === 'dark');

    this.updateViewFromRoute(this.router.url);
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

  private updateViewFromRoute(url: string): void {
    if (/\/foros\/\d+/.test(url)) {
      this.docentePanelView.set('foro-detalle');
    } else if (url.includes('dashboard')) {
      this.docentePanelView.set('dashboard');
    } else if (url.includes('mis-cursos')) {
      this.docentePanelView.set('mis-cursos');
    } else if (url.includes('estudiantes')) {
      this.docentePanelView.set('estudiantes');
    } else if (url.includes('tareas')) {
      this.docentePanelView.set('tareas');
    } else if (url.includes('mensajes')) {
      this.docentePanelView.set('mensajes');
    } else if (url.includes('foros')) {
      this.docentePanelView.set('foros');
    }
  }
}
