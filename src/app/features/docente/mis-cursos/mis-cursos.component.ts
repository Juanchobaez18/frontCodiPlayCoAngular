import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { DocenteApiService, DocenteCurso, CursoDetalle, EstudianteProgreso } from '../services/docente-api.service';
import { ProgressWsService } from '../../../core/services/progress-ws.service';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.scss'],
})
export class MisCursosComponent implements OnDestroy {
  private apiService = inject(DocenteApiService);
  private progressWs = inject(ProgressWsService);

  cursos = signal<DocenteCurso[]>([]);
  cursosLoading = signal(true);
  cursosError = signal<string>('');

  cursosDetalle = signal<Map<number, CursoDetalle>>(new Map());
  detalleLoading = signal<Set<number>>(new Set());

  private wsSub: Subscription | null = null;

  constructor() {
    this.loadCursos();
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  private loadCursos() {
    this.cursosLoading.set(true);
    this.apiService.getCursos().subscribe({
      next: (data) => {
        this.cursos.set(data);
        this.cursosLoading.set(false);

        // Subscribe to each course's WebSocket room so progress updates arrive live
        this.wsSub?.unsubscribe();
        this.progressWs.connect();
        data.forEach((c) => this.progressWs.joinCurso(c.id));
        this.wsSub = this.progressWs.progreso$.subscribe(() => {
          // Reload courses list to refresh progress bars
          this.apiService.getCursos().subscribe({
            next: (updated) => {
              this.cursos.set(updated);
              updated.forEach((c) => this.loadCursoDetalle(c.id));
            },
          });
        });

        // Load detail for each course
        data.forEach((c) => this.loadCursoDetalle(c.id));
      },
      error: (error) => {
        console.error('Error loading cursos:', error);
        this.cursosError.set('Error cargando cursos');
        this.cursosLoading.set(false);
      },
    });
  }

  private loadCursoDetalle(cursoId: number) {
    const loading = new Set(this.detalleLoading());
    loading.add(cursoId);
    this.detalleLoading.set(loading);

    this.apiService.getCursoDetalle(cursoId).subscribe({
      next: (detalle) => {
        const map = new Map(this.cursosDetalle());
        map.set(cursoId, detalle);
        this.cursosDetalle.set(map);

        const l = new Set(this.detalleLoading());
        l.delete(cursoId);
        this.detalleLoading.set(l);
      },
      error: () => {
        const l = new Set(this.detalleLoading());
        l.delete(cursoId);
        this.detalleLoading.set(l);
      },
    });
  }

  getDetalle(cursoId: number): CursoDetalle | undefined {
    return this.cursosDetalle().get(cursoId);
  }

  isDetalleLoading(cursoId: number): boolean {
    return this.detalleLoading().has(cursoId);
  }

  getEstadoClass(progreso: number): string {
    if (progreso >= 100) return 'completado';
    if (progreso >= 50) return 'medio';
    return 'bajo';
  }

  getEstadoLabel(est: EstudianteProgreso): string {
    if (est.estado === 'completado' || est.progreso >= 100) return 'Completado';
    if (est.estado === 'en_progreso' || est.progreso > 0) return 'En progreso';
    return 'Iniciando';
  }

  getEstadoIcon(est: EstudianteProgreso): string {
    if (est.estado === 'completado' || est.progreso >= 100) return 'fas fa-check-circle';
    if (est.estado === 'en_progreso' || est.progreso > 0) return 'fas fa-spinner';
    return 'fas fa-clock';
  }

  getEstadoCssClass(est: EstudianteProgreso): string {
    if (est.estado === 'completado' || est.progreso >= 100) return 'estado-completado';
    if (est.estado === 'en_progreso' || est.progreso > 0) return 'estado-progreso';
    return 'estado-inicial';
  }
}
