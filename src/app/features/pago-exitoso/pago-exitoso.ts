import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

const API_BASE = 'https://codiplayconest.onrender.com';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pago-exitoso.html',
  styleUrl: './pago-exitoso.scss',
})
export class PagoExitosoComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  transaccionId: string | null = null;
  confirmando = signal(true);
  inscrito = signal(false);
  errorConfirm = signal(false);
  cursoId = signal<number | null>(null);
  countdown = signal(3);

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.transaccionId = this.route.snapshot.queryParamMap.get('transaccion');
    const tid = Number(this.transaccionId);

    if (!tid) {
      this.confirmando.set(false);
      this.errorConfirm.set(true);
      return;
    }

    this.http
      .get<{ inscrito: boolean; cursoId: number }>(
        `${API_BASE}/payments/confirm-enrollment?transaccionId=${tid}`,
      )
      .pipe(catchError(() => of({ inscrito: false, cursoId: 0 })))
      .subscribe((result) => {
        this.confirmando.set(false);
        this.inscrito.set(result.inscrito);
        this.cursoId.set(result.cursoId || null);

        if (result.inscrito) {
          this.startCountdown();
        } else {
          this.errorConfirm.set(true);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        clearInterval(this.countdownInterval!);
        this.countdownInterval = null;
        this.router.navigateByUrl('/estudiante/inicio');
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  irAlPanel(): void {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.router.navigateByUrl('/estudiante/inicio');
  }
}

