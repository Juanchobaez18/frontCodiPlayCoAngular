import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DocenteApiService, DocenteTarea } from '../services/docente-api.service';
import { ProgressWsService } from '../../../core/services/progress-ws.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareasComponent implements OnDestroy {
  private apiService = inject(DocenteApiService);
  private progressWs = inject(ProgressWsService);

  tareas = signal<DocenteTarea[]>([]);
  tareasLoading = signal(true);
  tareasError = signal<string>('');
  calificando = signal<Set<number>>(new Set());

  // Inline due-date editing state
  editFechaId: number | null = null;
  editFechaValue = '';
  savingFecha = false;

  private wsSub: Subscription | null = null;

  constructor() {
    this.loadTareas();

    // Connect WS and reload task list whenever a student submits
    this.progressWs.connect();
    this.wsSub = this.progressWs.progreso$.subscribe(() => {
      this.loadTareas();
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  loadTareas() {
    this.tareasLoading.set(true);
    this.apiService.getTareas().subscribe({
      next: (data) => {
        this.tareas.set(data);
        this.tareasLoading.set(false);

        // Join WebSocket course rooms so we receive student task submissions in real-time
        const cursoIds = new Set<number>();
        data.forEach(t => {
          if (t.cursoId) {
            cursoIds.add(t.cursoId);
          }
        });
        cursoIds.forEach(id => this.progressWs.joinCurso(id));
      },
      error: (error) => {
        console.error('Error loading tareas:', error);
        this.tareasError.set('Error cargando tareas');
        this.tareasLoading.set(false);
      },
    });
  }

  calificar(entregaId: number, resultado: string) {
    const loading = new Set(this.calificando());
    loading.add(entregaId);
    this.calificando.set(loading);

    this.apiService.calificarTarea(entregaId, resultado).subscribe({
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
      },
    });
  }

  isCalificando(entregaId: number): boolean {
    return this.calificando().has(entregaId);
  }

  // ── Inline due-date editing ──

  startEditFecha(tarea: DocenteTarea): void {
    this.editFechaId = tarea.id;
    // Convert the stored ISO string to YYYY-MM-DD for the <input type="date">
    const d = new Date(tarea.fechaVencimiento);
    const pad = (n: number) => String(n).padStart(2, '0');
    this.editFechaValue = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  cancelEditFecha(): void {
    this.editFechaId = null;
    this.editFechaValue = '';
  }

  saveFecha(tareaId: number): void {
    if (!this.editFechaValue) return;
    this.savingFecha = true;
    this.apiService.updateFechaVencimiento(tareaId, this.editFechaValue).subscribe({
      next: () => {
        this.savingFecha = false;
        this.editFechaId = null;
        this.loadTareas();
      },
      error: () => {
        this.savingFecha = false;
      },
    });
  }

  formatFecha(iso: string | undefined): string {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-CO');
  }
}
