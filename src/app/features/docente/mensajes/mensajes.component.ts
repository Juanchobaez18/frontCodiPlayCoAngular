import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteApiService, DocenteMensaje, DocenteEstudiante } from '../services/docente-api.service';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss'],
})
export class MensajesComponent {
  private apiService = inject(DocenteApiService);

  mensajesTab = signal<'enviar' | 'enviados' | 'recibidos'>('enviar');
  mensajesEnviados = signal<DocenteMensaje[]>([]);
  mensajesRecibidos = signal<DocenteMensaje[]>([]);
  mensajesLoading = signal(false);
  mensajeSending = signal(false);

  // Destinatarios (estudiantes)
  estudiantes = signal<DocenteEstudiante[]>([]);
  estudiantesLoading = signal(true);

  // Form fields
  mensajeDestinatarioId = signal<number | null>(null);
  mensajeBody = signal('');

  // Messages
  successMessage = signal('');
  errorMessage = signal('');

  constructor() {
    this.loadEstudiantes();
    this.loadMensajes();
  }

  setMensajesTab(tab: 'enviar' | 'enviados' | 'recibidos', event?: Event) {
    if (event) event.preventDefault();
    this.mensajesTab.set(tab);
    sessionStorage.setItem('activeTab', 'tab-' + tab);
  }

  private loadEstudiantes() {
    this.estudiantesLoading.set(true);
    this.apiService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes.set(data || []);
        this.estudiantesLoading.set(false);
      },
      error: () => {
        this.estudiantesLoading.set(false);
      },
    });
  }

  private loadMensajes() {
    this.mensajesLoading.set(true);
    this.apiService.getMensajes().subscribe({
      next: (data) => {
        // Separate by tipo or show all in both
        const enviados = (data || []).filter((m) => m.tipo === 'enviado' || !m.tipo);
        const recibidos = (data || []).filter((m) => m.tipo === 'recibido');
        this.mensajesEnviados.set(enviados);
        this.mensajesRecibidos.set(recibidos);
        this.mensajesLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading mensajes:', error);
        this.mensajesLoading.set(false);
      },
    });
  }

  enviarMensaje() {
    const destinatarioId = this.mensajeDestinatarioId();
    const contenido = this.mensajeBody().trim();

    if (!destinatarioId || !contenido) {
      this.errorMessage.set('Por favor complete todos los campos');
      return;
    }

    this.mensajeSending.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.apiService.sendMensaje({ destinatarioId, contenido }).subscribe({
      next: () => {
        this.mensajeSending.set(false);
        this.successMessage.set('Mensaje enviado exitosamente');
        this.mensajeDestinatarioId.set(null);
        this.mensajeBody.set('');
        this.loadMensajes();
      },
      error: (err) => {
        this.mensajeSending.set(false);
        this.errorMessage.set('Error al enviar el mensaje');
        console.error('Error sending mensaje:', err);
      },
    });
  }
}
