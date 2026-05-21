// src/app/lecciones/componentes/admin/lista-lecciones-admin/lista-lecciones-admin.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Leccion } from '../../../modelos/leccion.model';
import { LeccionesService } from '../../../servicios/lecciones.service';

@Component({
  selector: 'app-lista-lecciones-admin',
  templateUrl: './lista-lecciones-admin.component.html',
  styleUrls: ['./lista-lecciones-admin.component.scss']
})
export class ListaLeccionesAdminComponent implements OnInit, OnDestroy {
  lecciones: Leccion[] = [];
  cargando = false;
  error: string | null = null;
  leccionAEliminar: Leccion | null = null;
  mostrandoDialogo = false;
  private destroy$ = new Subject<void>();

  constructor(
    private leccionesService: LeccionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLecciones();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarLecciones(): void {
    this.cargando = true;
    this.error = null;
    
    this.leccionesService.getLecciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.lecciones = data.sort((a, b) => parseInt(a.orden) - parseInt(b.orden));
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las lecciones. Por favor intenta nuevamente.';
          this.cargando = false;
          console.error('Error cargando lecciones:', err);
        }
      });
  }

  irACrear(): void {
    this.router.navigate(['/admin/lecciones/nueva']);
  }

  irAEditar(id: number): void {
    this.router.navigate(['/admin/lecciones', id, 'editar']);
  }

  irAEliminar(id: number): void {
    const leccion = this.lecciones.find(l => l.id === id);
    if (leccion) {
      this.leccionAEliminar = leccion;
      this.mostrandoDialogo = true;
    }
  }

  confirmarEliminacion(): void {
    if (!this.leccionAEliminar) return;

    this.leccionesService.deleteLeccion(this.leccionAEliminar.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.mostrandoDialogo = false;
          this.leccionAEliminar = null;
          this.cargarLecciones();
        },
        error: (err) => {
          this.error = 'Error al eliminar la lección';
          console.error('Error:', err);
        }
      });
  }

  cancelarEliminacion(): void {
    this.mostrandoDialogo = false;
    this.leccionAEliminar = null;
  }

  getEstadoBadge(estado: string): string {
    switch (estado) {
      case 'publicado':
        return 'badge-publicado';
      case 'borrador':
        return 'badge-borrador';
      default:
        return 'badge-default';
    }
  }
}
