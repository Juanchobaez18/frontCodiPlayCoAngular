import { Component } from '@angular/core';

@Component({
  selector: 'app-curso',
  imports: [],
  templateUrl: './curso.html',
  styleUrl: './curso.scss',
})
export class Curso {
  mobileMenuOpen = false;

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMenu(): void {
    if (!this.mobileMenuOpen) return;
    this.mobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }
}

