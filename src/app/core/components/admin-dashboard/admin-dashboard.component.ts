import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { DashboardStats } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  @Input() loading = true;
  @Input() stats: DashboardStats | null = null;
  @Input() error: string | null = null;

  estudiantesActivos(): number {
    return this.loading ? 0 : (this.stats?.totalEstudiantes ?? 0);
  }

  cursosActivos(): number {
    return this.loading ? 0 : (this.stats?.totalCursosActivos ?? 0);
  }

  docentesActivos(): number {
    return this.loading ? 0 : (this.stats?.totalDocentesActivos ?? 0);
  }

  tasaExito(): number {
    if (this.loading || !this.stats) return 0;
    const total = this.stats.totalEstudiantes ?? 0;
    const activos = this.stats.totalEstudiantesActivos ?? 0;
    if (total === 0) return 0;
    return Math.round((activos / total) * 100);
  }

  tasaExitoBarWidth(): string {
    return `${this.tasaExito()}%`;
  }
}
