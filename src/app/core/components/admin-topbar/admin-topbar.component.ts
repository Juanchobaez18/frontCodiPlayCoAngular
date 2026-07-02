import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Moon, Sun } from 'lucide-angular';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [RouterLink, AdminLucideIconsModule],
  templateUrl: './admin-topbar.component.html',
})
export class AdminTopbarComponent {
  @Input({ required: true }) userName!: string;
  @Input({ required: true }) userRole!: string;
  @Input() isDark = false;
  @Output() readonly darkModeToggle = new EventEmitter<void>();

  protected readonly iMoon = Moon;
  protected readonly iSun = Sun;
}

