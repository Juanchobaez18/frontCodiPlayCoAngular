import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginInterface } from '../interfaces/login';
import { Auth } from '../../core/services/auth';
import { PendingCourseService } from '../../core/services/pending-course.service';
import { userHasAdminPanelAccess } from '../../core/config/admin-panel-access.config';
import { userHasDocentePanelAccess } from '../../core/config/docente-panel-access.config';
import { userHasEstudiantePanelAccess } from '../../core/config/estudiante-panel-access.config';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogIn {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly pendingCourse = inject(PendingCourseService);
  private readonly fb = inject(FormBuilder);

  errorMessage = '';
  loading = false;
  stars = Array(12);

  loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value as LoginInterface).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res.user.isActive) {
          this.authService.logout();
          this.errorMessage = 'Tu cuenta está desactivada. Comunícate con el administrador.';
          return;
        }

        // A pending course always takes priority over the default post-login destination.
        // This handles: unauthenticated user clicked "Inscribirme", saved the course, logged in.
        const cursoId = this.pendingCourse.consume();
        if (cursoId) {
          this.router.navigate(['/registro-pago', cursoId]);
          return;
        }

        if (userHasAdminPanelAccess(res.user)) {
          this.router.navigate(['/admin/dashboard']);
        } else if (userHasDocentePanelAccess(res.user)) {
          this.router.navigate(['/docente/dashboard']);
        } else if (userHasEstudiantePanelAccess(res.user)) {
          this.router.navigate(['/estudiante/inicio']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message;
        this.errorMessage = Array.isArray(msg)
          ? msg.join(', ')
          : (msg ?? 'Correo o contraseña incorrectos.');
      },
    });
  }
}

