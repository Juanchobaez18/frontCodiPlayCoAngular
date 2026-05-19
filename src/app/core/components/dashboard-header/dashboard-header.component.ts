import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bell, Moon, Sun, Search } from 'lucide-angular';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [FormsModule, AdminLucideIconsModule],
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent {
  @Input({ required: true }) greetingName!: string;
  @Input() isDark = false;
  @Input() searchQuery = '';
  @Output() readonly searchQueryChange = new EventEmitter<string>();
  @Output() readonly darkModeToggle = new EventEmitter<void>();

  protected readonly iBell = Bell;
  protected readonly iMoon = Moon;
  protected readonly iSun = Sun;
  protected readonly iSearch = Search;

  onSearchInput(value: string): void {
    this.searchQueryChange.emit(value);
  }
}
