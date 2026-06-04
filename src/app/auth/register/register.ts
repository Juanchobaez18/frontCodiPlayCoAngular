import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../core/services/auth';
import type { AuthResponse } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  private readonly API = 'http://localhost:3000/auth/register';

  loading = false;
  errorMessage = '';
  successMessage = '';
  stars = Array(6);

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
    this.successMessage = '';

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
        localStorage.setItem('token', res.access_token);

        const pendingCursoId = localStorage.getItem('pendingCursoId');
        if (pendingCursoId) {
          localStorage.removeItem('pendingCursoId');
          this.router.navigate(['/registro-pago', pendingCursoId]);
        } else {
          this.router.navigate(['/cursos']);
        }
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
