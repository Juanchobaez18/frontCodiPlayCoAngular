import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteApiService, DocenteTarea } from '../services/docente-api.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareasComponent {
  private apiService = inject(DocenteApiService);

  tareas = signal<DocenteTarea[]>([]);
  tareasLoading = signal(true);
  tareasError = signal<string>('');
  calificando = signal<Set<number>>(new Set());

  constructor() {
    this.loadTareas();
  }

  private loadTareas() {
    this.tareasLoading.set(true);
    this.apiService.getTareas().subscribe({
      next: (data) => {
        this.tareas.set(data);
        this.tareasLoading.set(false);
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
        // Refresh tareas
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
}
