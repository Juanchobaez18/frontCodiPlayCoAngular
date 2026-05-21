import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { filter, switchMap, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Auth, User } from '../core/services/auth';
import { PerfilService } from './services/perfil.service';
import { UserService } from '../users/services/user.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private authService = inject(Auth);
  private perfilService = inject(PerfilService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  private currentUser$ = toObservable(this.authService.currentUser);

  user: User | undefined;
  avatarUrl: string | null = null;
  avatarInitials = '';
  isLoading = true;
  fecharegistro: string | null = null;

  isLoadingAvatar = false;
  avatarError = '';
  avatarSuccess = '';

  passForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatch }
  );
  isLoadingPass = false;
  passError = '';
  passSuccess = '';

  ngOnInit() {
    this.currentUser$
      .pipe(
        filter((u) => !!u?.id),
        take(1)
      )
      .subscribe((u) => {
        this.user = u;
        this.isLoading = false;
        this.resolveAvatar(u!.avatar);
      });

    this.currentUser$
      .pipe(
        filter((u) => !!u?.id),
        take(1),
        switchMap(() => this.userService.getEstudianteProfile())
      )
      .subscribe({
        next: (perfil) => { this.fecharegistro = perfil?.fecharegistro ?? null; },
        error: () => { this.fecharegistro = null; },
      });
  }

  private resolveAvatar(avatar: string | undefined) {
    this.avatarUrl = avatar?.startsWith('uploads/')
      ? `http://localhost:3000/${avatar}`
      : null;
    const u = this.user;
    this.avatarInitials =
      `${u?.name?.charAt(0) ?? ''}${u?.lastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const p = group.get('newPassword')?.value;
    const c = group.get('confirmPassword')?.value;
    return p === c ? null : { mismatch: true };
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.avatarError = 'Solo se permiten archivos JPG, PNG o WEBP.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.avatarError = 'El archivo no puede superar los 2MB.';
      return;
    }

    this.avatarError = '';
    this.avatarSuccess = '';
    this.isLoadingAvatar = true;

    this.perfilService.uploadAvatar(this.user!.id, file).subscribe({
      next: (updated: any) => {
        this.isLoadingAvatar = false;
        this.avatarSuccess = '¡Foto actualizada correctamente!';
        this.resolveAvatar(updated.avatar);
        input.value = '';
      },
      error: (err: any) => {
        this.isLoadingAvatar = false;
        this.avatarError = err?.error?.message ?? 'Error al subir la imagen.';
        input.value = '';
      },
    });
  }

  savePassword() {
    if (this.passForm.invalid) {
      this.passForm.markAllAsTouched();
      return;
    }
    this.isLoadingPass = true;
    this.passError = '';
    this.passSuccess = '';

    this.perfilService
      .updatePassword(this.user!.id, this.passForm.get('newPassword')!.value)
      .subscribe({
        next: () => {
          this.isLoadingPass = false;
          this.passSuccess = '¡Contraseña actualizada correctamente!';
          this.passForm.reset();
        },
        error: (err: any) => {
          this.isLoadingPass = false;
          this.passError = err?.error?.message ?? 'Error al cambiar la contraseña.';
        },
      });
  }
}
