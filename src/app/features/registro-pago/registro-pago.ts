import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../core/services/auth';
import { PendingCourseService } from '../../core/services/pending-course.service';

interface CursoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  dificultad: string;
  precio: number;
  estado: boolean;
}

@Component({
  selector: 'app-registro-pago',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './registro-pago.html',
  styleUrl: './registro-pago.scss',
})
export class RegistroPagoComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pendingCourse = inject(PendingCourseService);
  readonly auth = inject(Auth);

  private readonly API = 'https://codiplayconest.onrender.com';

  curso: CursoDetalle | null = null;
  cursoLoading = true;
  cursoError: string | null = null;
  procesando = false;
  pagoError: string | null = null;
  cancelado = false;

  ngOnInit(): void {
    // The user has reached the payment page, so the pending-course handshake
    // is complete. Clear it to prevent stale redirects on future logins.
    this.pendingCourse.clear();

    this.cancelado = this.route.snapshot.queryParamMap.get('cancelado') === 'true';

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.cursoError = 'ID de curso no encontrado.';
      this.cursoLoading = false;
      return;
    }

    this.http.get<CursoDetalle>(`${this.API}/curso/${id}`).subscribe({
      next: (data) => {
        this.curso = data;
        this.cursoLoading = false;
      },
      error: () => {
        this.cursoError = 'No se pudo cargar la información del curso.';
        this.cursoLoading = false;
      },
    });
  }

  irAlPago(): void {
    if (!this.curso) return;

    // Token check is a fast-fail before the HTTP request.
    // If there is somehow no token here, preserve the course so the user
    // lands back on this page automatically after re-authenticating.
    if (!localStorage.getItem('token')) {
      this.pendingCourse.save(this.curso.id);
      this.router.navigate(['/auth/login']);
      return;
    }

    this.procesando = true;
    this.pagoError = null;

    // Authorization header is added automatically by authInterceptor
    this.http
      .post<{ url: string; transactionId: number }>(
        `${this.API}/payments/stripe/create-session`,
        {
          courseId: Number(this.curso.id),
          amount: Number(this.curso.precio),
          courseName: this.curso.nombre,
        },
      )
      .subscribe({
        next: (res) => {
          window.location.href = res.url;
        },
        error: (err) => {
          this.procesando = false;
          const msg = err?.error?.message;
          this.pagoError = Array.isArray(msg)
            ? msg.join(', ')
            : (msg ?? 'Error al iniciar el pago. Inténtalo de nuevo.');
        },
      });
  }

  getFilledStars(dificultad: string): number[] {
    const d = (dificultad ?? '').toLowerCase();
    if (d.includes('alta')) return [1, 2, 3, 4, 5];
    if (d.includes('media')) return [1, 2, 3];
    return [1];
  }

  getEmptyStars(dificultad: string): number[] {
    return Array(5 - this.getFilledStars(dificultad).length).fill(0);
  }
}

