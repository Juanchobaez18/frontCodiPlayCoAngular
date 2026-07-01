import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
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

