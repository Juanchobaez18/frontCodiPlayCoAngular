import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Leccion, ProgresoLeccion } from '../../../modelos/leccion.model';
import { LeccionesService } from '../../../servicios/lecciones.service';

@Component({
  selector: 'app-lista-lecciones-estudiante',
  templateUrl: './lista-lecciones-estudiante.component.html',
  styleUrls: ['./lista-lecciones-estudiante.component.scss']
})
export class ListaLeccionesEstudianteComponent implements OnInit, OnDestroy {
  lecciones: Leccion[] = [];
  progresoMap: Map<string, ProgresoLeccion> = new Map();
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
    
    this.leccionesService.getLeccionesPublicadas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.lecciones = data.sort((a, b) => a.orden - b.orden);
          this.cargarProgreso();
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las lecciones';
          this.cargando = false;
          console.error('Error:', err);
        }
      });
  }

  cargarProgreso(): void {
    this.lecciones.forEach(leccion => {
      this.leccionesService.getProgresoLeccion(leccion.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (progreso) => {
            this.progresoMap.set(leccion.id, progreso);
          },
          error: () => {
            // Si no hay progreso, es normal
          }
        });
    });
  }

  verDetalle(id: string): void {
    this.router.navigate(['/lecciones', id]);
  }

  estaCompletada(id: string): boolean {
    return this.progresoMap.get(id)?.completada || false;
  }
}
