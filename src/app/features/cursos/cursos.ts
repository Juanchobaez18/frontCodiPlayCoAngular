import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../core/services/auth';
import { PendingCourseService } from '../../core/services/pending-course.service';

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  dificultad: string;
  precio: number;
  estado: boolean;
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss',
})
export class CursosComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly pendingCourse = inject(PendingCourseService);

  cursos: Curso[] = [];
  loading = true;
  error: string | null = null;
  mobileMenuOpen = false;

  private readonly cardGradients = [
    ['#e63946', '#f4a261'],
    ['#7209b7', '#4361ee'],
    ['#06d6a0', '#118ab2'],
    ['#f77f00', '#d62828'],
    ['#f72585', '#7209b7'],
    ['#2d6a4f', '#52b788'],
  ];

  ngOnInit(): void {
    this.http.get<Curso[]>('https://codiplayconest.onrender.com/curso').subscribe({
      next: (data) => {
        this.cursos = data.filter(c => c.estado);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los cursos.';
        this.loading = false;
      },
    });
  }

  inscribirme(cursoId: number): void {
    this.pendingCourse.save(cursoId);

    // isAuthenticated() relies on the in-memory signal, which resets on F5.
    // Falling back to the stored token lets returning users skip the register form
    // and go straight to payment. The authGuard will still validate the token.
    const hasSession = this.auth.isAuthenticated() || !!localStorage.getItem('token');

    this.router.navigate(hasSession ? ['/registro-pago', cursoId] : ['/auth/register']);
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  getCardStyle(index: number): string {
    const [c1, c2] = this.cardGradients[index % this.cardGradients.length];
    return `background: linear-gradient(145deg, ${c1}, ${c2})`;
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

  shortDesc(text: string, max = 90): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}

