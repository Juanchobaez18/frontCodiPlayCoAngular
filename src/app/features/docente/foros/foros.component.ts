import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocenteApiService, DocenteCurso, DocenteForo, CreateForoDto } from '../services/docente-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-foros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foros.component.html',
  styleUrls: ['./foros.component.scss'],
})
export class ForosComponent {
  private apiService = inject(DocenteApiService);
  private router = inject(Router);

  cursos = signal<DocenteCurso[]>([]);
  forosData = signal<DocenteForo[]>([]);
  forosLoading = signal(true);
  forosError = signal<string>('');

  // Crear foro form
  nuevoTitulo = signal('');
  nuevaDescripcion = signal('');
  nuevoCursoId = signal<number | null>(null);
  creando = signal(false);

  // Editar foro modal
  modalOpen = signal(false);
  editarForoId = signal<number | null>(null);
  editarTitulo = signal('');
  editarDescripcion = signal('');
  editando = signal(false);

  // Mensajes
  successMessage = signal('');
  errorMessage = signal('');

  constructor() {
    this.loadData();
  }

  private loadData() {
    this.forosLoading.set(true);
    Promise.all([
      this.apiService.getCursos().toPromise(),
      this.apiService.getForos().toPromise(),
    ])
      .then(([cursos, foros]) => {
        this.cursos.set(cursos || []);
        this.forosData.set(foros || []);
        this.forosLoading.set(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        this.forosError.set('Error cargando foros');
        this.forosLoading.set(false);
      });
  }

  // ─── Crear Foro ───
  crearForo() {
    const titulo = this.nuevoTitulo().trim();
    const descripcion = this.nuevaDescripcion().trim();
    const cursoId = this.nuevoCursoId();

    if (!titulo || !descripcion || !cursoId) {
      this.errorMessage.set('Por favor complete todos los campos');
      return;
    }

    this.creando.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const dto: CreateForoDto = { titulo, descripcion, cursoId };
    this.apiService.createForo(dto).subscribe({
      next: () => {
        this.creando.set(false);
        this.successMessage.set('Foro creado exitosamente');
        this.nuevoTitulo.set('');
        this.nuevaDescripcion.set('');
        this.nuevoCursoId.set(null);
        this.loadData();
      },
      error: (err) => {
        this.creando.set(false);
        this.errorMessage.set('Error al crear el foro');
        console.error('Error creating foro:', err);
      },
    });
  }

  // ─── Abrir modal editar ───
  abrirEditar(foro: DocenteForo) {
    this.editarForoId.set(foro.id);
    this.editarTitulo.set(foro.titulo);
    this.editarDescripcion.set(foro.descripcion);
    this.modalOpen.set(true);
  }

  cerrarModal() {
    this.modalOpen.set(false);
  }

  guardarEdicion() {
    const id = this.editarForoId();
    const titulo = this.editarTitulo().trim();
    const descripcion = this.editarDescripcion().trim();

    if (!id || !titulo || !descripcion) {
      alert('Por favor complete todos los campos');
      return;
    }

    this.editando.set(true);
    this.apiService.updateForo(id, { titulo, descripcion }).subscribe({
      next: () => {
        this.editando.set(false);
        this.modalOpen.set(false);
        this.successMessage.set('Foro actualizado exitosamente');
        this.loadData();
      },
      error: (err) => {
        this.editando.set(false);
        this.errorMessage.set('Error al actualizar el foro');
        console.error('Error updating foro:', err);
      },
    });
  }

  // ─── Eliminar foro ───
  eliminarForo(foro: DocenteForo) {
    Swal.fire({
      title: '<h2 class="swal-title">Confirmar Eliminación</h2>',
      html: `
        <div style="text-align: center;">
          <div style="margin-bottom: 1rem;">
            <i class="fas fa-trash-alt" style="font-size: 2.5rem; color: #ef4444;"></i>
          </div>
          <p style="margin-bottom: 0.5rem;">Estás a punto de eliminar el foro:</p>
          <div style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3); border-radius: 8px; padding: 0.75rem; margin: 0.75rem 0;">
            <i class="fas fa-comments" style="color: #a855f7;"></i>
            <strong style="color: #a855f7;"> ${foro.titulo}</strong>
          </div>
          <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 0.5rem; margin-top: 0.75rem;">
            <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
            <span style="color: #ef4444;"> Esta acción no se puede deshacer</span>
          </div>
        </div>
      `,
      icon: undefined,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
      cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      allowOutsideClick: false,
      allowEscapeKey: true,
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando foro...',
          html: '<p>Procesando tu solicitud...</p>',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        this.apiService.deleteForo(foro.id).subscribe({
          next: () => {
            Swal.close();
            this.successMessage.set('Foro eliminado exitosamente');
            this.loadData();
          },
          error: (err) => {
            Swal.close();
            this.errorMessage.set('Error al eliminar el foro');
            console.error('Error deleting foro:', err);
          },
        });
      }
    });
  }

  // ─── Ver respuestas ───
  verRespuestas(foroId: number) {
    this.router.navigate(['/docente/foros', foroId]);
  }

  // ─── Agrupar foros por curso ───
  getForosPorCurso(): { cursoNombre: string; foros: DocenteForo[] }[] {
    const grouped = new Map<string, DocenteForo[]>();
    for (const foro of this.forosData()) {
      const nombre = foro.cursoNombre || 'Sin curso';
      if (!grouped.has(nombre)) {
        grouped.set(nombre, []);
      }
      grouped.get(nombre)!.push(foro);
    }
    return Array.from(grouped.entries()).map(([cursoNombre, foros]) => ({
      cursoNombre,
      foros,
    }));
  }
}
