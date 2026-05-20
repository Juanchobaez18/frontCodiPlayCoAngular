import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Mail,
  LogOut,
  Sun,
  Moon,
} from 'lucide-angular';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AdminLucideIconsModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() brandTitle = 'CodiPlayCo';
  @Input() brandSubtitle = 'Admin Dashboard';
  @Input() userName = '';
  @Input() userEmail = '';
  @Input() isDark = false;
  @Output() logout = new EventEmitter<void>();
  @Output() darkModeToggle = new EventEmitter<void>();

  get userInitial(): string {
    const trimmed = this.userName.trim();
    const first = trimmed.split(/\s+/)[0];
    return (first?.[0] ?? 'A').toUpperCase();
  }

  protected readonly iDash = LayoutDashboard;
  protected readonly iUsers = Users;
  protected readonly iTeach = GraduationCap;
  protected readonly iCourses = BookOpen;
  protected readonly iMsg = Mail;
  protected readonly iLogOut = LogOut;
  protected readonly iSun = Sun;
  protected readonly iMoon = Moon;
}
