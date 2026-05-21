import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Leccion, ProgresoLeccion } from '../../../modelos/leccion.model';
import { LeccionesService } from '../../../servicios/lecciones.service';

@Component({
  selector: 'app-lista-lecciones-estudiante',
  templateUrl: './lista-lecciones-estudiante.component.html',
  styleUrls: ['./lista-lecciones-estudiante.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ListaLeccionesEstudianteComponent implements OnInit, OnDestroy {
  lecciones: Leccion[] = [];
  cargando = false;
  error: string | null = null;
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
          // Filtrar solo lecciones publicadas y ordenar por orden numérico
          this.lecciones = data
            .filter(leccion => leccion.estado === 'publicado')
            .sort((a, b) => parseInt(a.orden) - parseInt(b.orden));
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las lecciones';
          this.cargando = false;
          console.error('Error:', err);
        }
      });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/lecciones', id]);
  }
}
