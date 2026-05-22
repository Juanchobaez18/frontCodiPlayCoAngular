import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  Mail,
  LogOut,
  Sun,
  Moon,
} from 'lucide-angular';
import { AdminLucideIconsModule } from '../../../core/components/admin-lucide-icons.module';

@Component({
  selector: 'app-docente-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AdminLucideIconsModule],
  templateUrl: './docente-sidebar.component.html',
})
export class DocenteSidebarComponent {
  @Input() brandTitle = 'CodiPlayCo';
  @Input() userName = '';
  @Input() userEmail = '';
  @Input() isDark = false;
  @Output() logout = new EventEmitter<void>();
  @Output() darkModeToggle = new EventEmitter<void>();

  get userInitial(): string {
    const trimmed = this.userName.trim();
    const first = trimmed.split(/\s+/)[0];
    return (first?.[0] ?? 'D').toUpperCase();
  }

  protected readonly iDash = LayoutDashboard;
  protected readonly iCourses = BookOpen;
  protected readonly iStudents = GraduationCap;
  protected readonly iTasks = ClipboardList;
  protected readonly iForums = MessageSquare;
  protected readonly iMsg = Mail;
  protected readonly iLogOut = LogOut;
  protected readonly iSun = Sun;
  protected readonly iMoon = Moon;
}
