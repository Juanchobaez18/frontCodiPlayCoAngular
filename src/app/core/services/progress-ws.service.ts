import { Injectable, OnDestroy, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject, Observable } from 'rxjs';
import { Auth } from './auth';

const WS_URL = 'http://localhost:3000/progress';

/**
 * Evento recibido cuando el progreso de un estudiante cambia.
 */
export interface ProgresoActualizadoEvent {
  estudianteId: number;
  progreso: number;
  leccionesCompletadas: number;
  leccionId?: number;
}

/**
 * Servicio Angular que gestiona la conexión WebSocket al namespace /progress.
 *
 * - El docente se une a las salas de sus cursos (`join-curso`) y recibe
 *   eventos de todos los estudiantes inscritos.
 * - El estudiante se une a su sala personal (`join-estudiante`) para recibir
 *   confirmación cuando su progreso es actualizado.
 *
 * El servicio se conecta de forma lazy (primera vez que se llama a connect())
 * y se desconecta automáticamente cuando el componente que lo usa es destruido.
 */
@Injectable({ providedIn: 'root' })
export class ProgressWsService implements OnDestroy {
  private readonly auth = inject(Auth);
  private socket: Socket | null = null;
  private readonly progresoSubject = new Subject<ProgresoActualizadoEvent>();

  /** Observable de eventos de progreso actualizado */
  readonly progreso$: Observable<ProgresoActualizadoEvent> =
    this.progresoSubject.asObservable();

  /** Conecta el socket si no está ya conectado */
  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('[ProgressWS] Conectado:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('[ProgressWS] Desconectado');
    });

    this.socket.on('progreso:actualizado', (data: ProgresoActualizadoEvent) => {
      this.progresoSubject.next(data);
    });

    this.socket.on('connect_error', (err: Error) => {
      console.warn('[ProgressWS] Error de conexión:', err.message);
    });
  }

  /** Suscribe al docente a la sala de un curso específico */
  joinCurso(cursoId: number): void {
    this.connect();
    this.socket?.emit('join-curso', { cursoId });
  }

  /** Suscribe al estudiante a su sala personal de actualizaciones */
  joinEstudiante(estudianteId: number): void {
    this.connect();
    this.socket?.emit('join-estudiante', { estudianteId });
  }

  /** Desconecta el socket */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.progresoSubject.complete();
  }
}
