import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
 
// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
 
import { LoginInterface } from '../interfaces/login';
import { Auth } from '../../core/services/auth';
import { userHasAdminPanelAccess } from '../../core/config/admin-panel-access.config';
import { userHasDocentePanelAccess } from '../../core/config/docente-panel-access.config';
 
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
 
  private fb          = inject(FormBuilder);
  private authService = inject(Auth);
  private router      = inject(Router);
 
  // ── Variables que necesita el HTML del diseño ──
  errorMessage: string = '';
  loading: boolean     = false;
  stars                = Array(12);
 
  loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
 
  onSubmit(): void {
    if (this.loginForm.invalid) return;
 
    this.loading      = true;
    this.errorMessage = '';
 
    const rawForm = this.loginForm.value as LoginInterface;
 
    this.authService.login(rawForm).subscribe({
      next: (res) => {
        this.loading = false;

        // Si el backend permite el login pero el usuario está inactivo,
        // cerramos sesión y mostramos el mensaje en la pantalla de login.
        if (!res.user.isActive) {
          this.authService.logout();
          this.errorMessage =
            'Tu cuenta está desactivada. Comunícate con el administrador para que reactive tu acceso.';
          return;
        }

        if (userHasAdminPanelAccess(res.user)) {
          this.router.navigate(['/admin/dashboard']);
        } else if (userHasDocentePanelAccess(res.user)) {
          this.router.navigate(['/docente/dashboard']);
        } else {
          this.router.navigate(['/users']);
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