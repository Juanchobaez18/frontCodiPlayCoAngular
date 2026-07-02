import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, EstudianteProfile } from './services/user.service';
import { Auth } from '../../core/services/auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, switchMap } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  private userService = inject(UserService);
  private authService = inject(Auth);

  estudiante: EstudianteProfile | null = null;
  isLoading = true;
  error = '';

  private currentUser$ = toObservable(this.authService.currentUser);

  ngOnInit() {
    this.currentUser$.pipe(
      filter(user => !!user?.id),
      take(1),
      switchMap(() => this.userService.getEstudianteProfile())
    ).subscribe({
      next: (data) => {
        this.estudiante = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error al cargar el perfil';
        this.isLoading = false;
      }
    });
  }
}
