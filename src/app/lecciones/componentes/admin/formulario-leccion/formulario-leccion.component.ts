import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Leccion, CrearLeccionDto, ActualizarLeccionDto, EstadoLeccion } from '../../../modelos/leccion.model';
import { LeccionesService } from '../../../servicios/lecciones.service';

@Component({
  selector: 'app-formulario-leccion',
  templateUrl: './formulario-leccion.component.html',
  styleUrls: ['./formulario-leccion.component.scss']
})
export class FormularioLeccionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  leccion: Leccion | null = null;
  modoEdicion = false;
  cargando = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private leccionesService: LeccionesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      contenido: ['', [Validators.required, Validators.minLength(20)]],
      orden: ['1', [Validators.required]],
      estado: ['borrador' as EstadoLeccion, Validators.required],
      moduloId: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.cargarLeccion(+id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarLeccion(id: number): void {
    this.cargando = true;
    this.leccionesService.getLeccionById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.leccion = data;
          this.form.patchValue({
            titulo: data.titulo,
            descripcion: data.descripcion,
            contenido: data.contenido,
            orden: data.orden,
            estado: data.estado
          });
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar la lección';
          this.cargando = false;
          console.error('Error cargando lección:', err);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = null;

    if (this.modoEdicion && this.leccion) {
      this.actualizarLeccion();
    } else {
      this.crearLeccion();
    }
  }

  crearLeccion(): void {
    const dto: CrearLeccionDto = this.form.value;
    this.leccionesService.createLeccion(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/lecciones']);
        },
        error: (err) => {
          this.error = 'Error al crear la lección';
          this.cargando = false;
          console.error('Error creando lección:', err);
        }
      });
  }

  actualizarLeccion(): void {
    if (!this.leccion) return;
    
    const dto: ActualizarLeccionDto = this.form.value;
    this.leccionesService.updateLeccion(this.leccion.id, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/lecciones']);
        },
        error: (err) => {
          this.error = 'Error al actualizar la lección';
          this.cargando = false;
          console.error('Error actualizando lección:', err);
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/admin/lecciones']);
  }
}
