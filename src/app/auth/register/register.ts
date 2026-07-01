import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth, type AuthResponse } from '../../core/services/auth';
import { PendingCourseService } from '../../core/services/pending-course.service';

interface CursoResumen {
  id: number;
  nombre: string;
  precio: number;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly pendingCourse = inject(PendingCourseService);

  private readonly API = 'https://codiplayconest.onrender.com/auth/register';

  loading = false;
  errorMessage = '';
  stars = Array(6);

  /** Populated when the user arrives via "Inscribirme" so the form shows the course context. */
  cursoPendiente: CursoResumen | null = null;

  form = {
    name: '',
    lastName: '',
    docType: '',
    docNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechanacimiento: '',
    edad: null as number | null,
  };

  ngOnInit(): void {
    const cursoId = this.pendingCourse.peek();
    if (cursoId) {
      this.http.get<CursoResumen>(`https://codiplayconest.onrender.com/curso/${cursoId}`).subscribe({
        next: (c) => { this.cursoPendiente = c; },
        error: () => { /* Banner is optional — form still works without it */ },
      });
    }
  }

  onFechaNacimientoChange(): void {
    if (!this.form.fechanacimiento) return;
    const hoy = new Date();
    const nacimiento = new Date(this.form.fechanacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    this.form.edad = edad > 0 ? edad : null;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    if (!this.form.edad || this.form.edad < 1) {
      this.errorMessage = 'Verifica la fecha de nacimiento.';
      return;
    }

    this.loading = true;
    const { confirmPassword, ...payload } = this.form;

    this.http.post<AuthResponse>(this.API, payload).subscribe({
      next: (res) => {
        this.loading = false;
        // Populate the Auth signal immediately so guards/components don't need
        // an extra checkAuthStatus() round-trip.
        this.auth.setAuthState(res);

        const cursoId = this.pendingCourse.consume();
        this.router.navigate(cursoId ? ['/registro-pago', cursoId] : ['/cursos']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message;
        this.errorMessage = Array.isArray(msg)
          ? msg.join(', ')
          : (msg ?? 'Ocurrió un error al registrarse. Intenta de nuevo.');
      },
    });
  }
}

