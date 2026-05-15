import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.scss']
})
export class ContactoComponent {
  submitted = false;
  errorMessage = '';
  successMessage = '';
  stars = Array.from({ length: 10 });

  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '¡Gracias! Hemos recibido tu solicitud. Te redirigimos al inicio...';

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1700);
  }
}
