import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DocenteApiService, DocenteForo, ForoRespuesta } from '../services/docente-api.service';

@Component({
  selector: 'app-foro-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './foro-detalle.component.html',
  styleUrls: ['./foro-detalle.component.scss'],
})
export class ForoDetalleComponent implements OnInit {
  private apiService = inject(DocenteApiService);
  private router = inject(Router);

  foro = signal<DocenteForo | null>(null);
  respuestas = signal<ForoRespuesta[]>([]);
  loading = signal(true);
  error = signal('');
  foroId = signal<number | null>(null);

  ngOnInit() {
    // Extract foroId from URL
    const url = this.router.url;
    const match = url.match(/\/foros\/(\d+)/);
    if (match) {
      const id = parseInt(match[1], 10);
      this.foroId.set(id);
      this.loadForo(id);
    } else {
      this.error.set('ID de foro no válido');
      this.loading.set(false);
    }
  }

  private loadForo(foroId: number) {
    this.loading.set(true);
    this.apiService.getForoById(foroId).subscribe({
      next: (foro) => {
        this.foro.set(foro);
        this.loadRespuestas(foroId);
      },
      error: (err) => {
        console.error('Error loading foro:', err);
        this.error.set('Error cargando el foro');
        this.loading.set(false);
      },
    });
  }

  private loadRespuestas(foroId: number) {
    this.apiService.getForoRespuestas(foroId).subscribe({
      next: (resp) => {
        this.respuestas.set(resp || []);
        this.loading.set(false);
      },
      error: () => {
        this.respuestas.set([]);
        this.loading.set(false);
      },
    });
  }

  volverAForos() {
    this.router.navigate(['/docente/foros']);
  }
}

