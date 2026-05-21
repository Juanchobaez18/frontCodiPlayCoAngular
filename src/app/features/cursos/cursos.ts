import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss'
})
export class CursosComponent {}
