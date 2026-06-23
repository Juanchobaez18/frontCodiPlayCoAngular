import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './preguntas-frecuentes.html',
  styleUrl: './preguntas-frecuentes.scss',
})
export class PreguntasFrecuentesComponent {
  mobileMenuOpen = false;
  flippedCards = new Set<number>();

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleCard(index: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (this.flippedCards.has(index)) {
      this.flippedCards.delete(index);
    } else {
      this.flippedCards.add(index);
    }
  }

  isFlipped(index: number): boolean {
    return this.flippedCards.has(index);
  }
}

