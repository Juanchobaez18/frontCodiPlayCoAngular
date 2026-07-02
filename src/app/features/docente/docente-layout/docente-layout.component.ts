import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { Auth } from '../../../core/services/auth';
import { userHasDocentePanelAccess } from '../../../core/config/docente-panel-access.config';
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

const DOCENTE_BODY_CLASS = 'docente-panel-active';

const DOCENTE_ASSET_STYLESHEETS: ReadonlyArray<readonly [string, string]> = [
  ['docente-asset-stylespanel', '/assetsDocente/stylespanel.css'],
  ['docente-asset-miscursos', '/assetsDocente/miscursos.css'],
  ['docente-asset-tareas', '/assetsDocente/tareas.css'],
  ['docente-asset-foros', '/assetsDocente/foros.css'],
  ['docente-asset-mensajes', '/assetsDocente/css/mensajes.css'],
  ['docente-asset-forodetalle', '/assetsDocente/css/forodetalle.css'],
];

@Component({
  selector: 'app-docente-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
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
export class DocenteLayoutComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  public authService = inject(Auth);

  isMenuOpen = signal(false);
  isDarkTheme = signal(true);
  docentePanelView = signal<DocentePanelView>('dashboard');

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );

  ngOnInit() {
    if (!userHasDocentePanelAccess(this.authService.currentUser())) {
      this.router.navigateByUrl('/users');
      return;
    }

    this.attachDocenteStylesheets();
    this.document.body.classList.add(DOCENTE_BODY_CLASS);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event: NavigationEnd) => {
        this.updateViewFromRoute(event.url);
      });

    this.updateViewFromRoute(this.router.url);

    const savedTheme = localStorage.getItem('theme') ?? localStorage.getItem('docenteTheme');
    const useDark = savedTheme !== 'light-mode' && savedTheme !== 'light';
    this.isDarkTheme.set(useDark);
    if (useDark) {
      this.document.body.classList.add('dark-mode');
    } else {
      this.document.body.classList.remove('dark-mode');
    }
  }

  ngOnDestroy(): void {
    this.removeDocenteStylesheets();
    this.document.body.classList.remove(DOCENTE_BODY_CLASS, 'dark-mode', 'light-theme');
  }

  private attachDocenteStylesheets(): void {
    const head = this.document.head;
    for (const [id, href] of DOCENTE_ASSET_STYLESHEETS) {
      if (this.document.getElementById(id)) continue;
      const link = this.document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      head.appendChild(link);
    }
  }

  private removeDocenteStylesheets(): void {
    for (const [id] of DOCENTE_ASSET_STYLESHEETS) {
      this.document.getElementById(id)?.remove();
    }
  }

  private updateViewFromRoute(url: string) {
    // Check foro-detalle FIRST (more specific: /foros/123)
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

  toggleTheme(event: Event) {
    const isDark = (event.target as HTMLInputElement).checked;
    this.isDarkTheme.set(isDark);
    if (isDark) {
      this.document.body.classList.add('dark-mode');
      this.document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark-mode');
    } else {
      this.document.body.classList.remove('dark-mode', 'light-theme');
      localStorage.setItem('theme', 'light-mode');
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
} // ← única llave de cierre
