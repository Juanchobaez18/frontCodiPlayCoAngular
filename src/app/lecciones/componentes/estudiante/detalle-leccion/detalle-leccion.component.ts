import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Leccion, ProgresoLeccion } from '../../../modelos/leccion.model';
import { LeccionesService } from '../../../servicios/lecciones.service';

@Component({
  selector: 'app-detalle-leccion',
  templateUrl: './detalle-leccion.component.html',
  styleUrls: ['./detalle-leccion.component.scss']
})
export class DetalleLeccionComponent implements OnInit, OnDestroy {
  leccion: Leccion | null = null;
  progreso: ProgresoLeccion | null = null;
  cargando = false;
  error: string | null = null;
  marcandoCompletada = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leccionesService: LeccionesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarLeccion(id);
      this.cargarProgreso(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarLeccion(id: string): void {
    this.cargando = true;
    this.leccionesService.getLeccionById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.leccion = data;
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar la lección';
          this.cargando = false;
          console.error('Error:', err);
        }
      });
  }

  cargarProgreso(id: string): void {
    this.leccionesService.getProgresoLeccion(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.progreso = data;
        },
        error: () => {
          // Si no hay progreso, es normal
        }
      });
  }

  marcarComoCompletada(): void {
    if (!this.leccion) return;

    this.marcandoCompletada = true;
    this.leccionesService.marcarComoCompletada(this.leccion.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.progreso = data;
          this.marcandoCompletada = false;
        },
        error: (err) => {
          this.error = 'Error al marcar como completada';
          this.marcandoCompletada = false;
          console.error('Error:', err);
        }
      });
  }

  volver(): void {
    this.router.navigate(['/lecciones']);
  }

  estaCompletada(): boolean {
    return this.progreso?.completada || false;
  }
}
