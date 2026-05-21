import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Leccion } from '../../../modelos/leccion.model';

@Component({
  selector: 'app-dialogo-eliminar-leccion',
  templateUrl: './dialogo-eliminar-leccion.component.html',
  styleUrls: ['./dialogo-eliminar-leccion.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DialogoEliminarLeccionComponent {
  @Input() leccion: Leccion | null = null;
  @Input() visible = false;
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
