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
}
