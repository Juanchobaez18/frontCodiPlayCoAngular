import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.scss',
})
export class QuienesSomosComponent {
  mobileMenuOpen = false;

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }
}
