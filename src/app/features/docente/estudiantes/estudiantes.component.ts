import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteApiService, DocenteEstudiante } from '../services/docente-api.service';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss'],
  providers: [DocenteApiService],
})
export class EstudiantesComponent {
  private apiService = inject(DocenteApiService);

  estudiantes = signal<DocenteEstudiante[]>([]);
  estudiantesLoading = signal(true);
  estudiantesError = signal<string>('');

  constructor() {
    this.loadEstudiantes();
  }

  private loadEstudiantes() {
    this.estudiantesLoading.set(true);
    this.apiService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes.set(data);
        this.estudiantesLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading estudiantes:', error);
        this.estudiantesError.set('Error cargando estudiantes');
        this.estudiantesLoading.set(false);
      },
    });
  }
}

