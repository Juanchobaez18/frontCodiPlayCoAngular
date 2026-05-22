import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Mail,
  LogOut,
  Moon,
  Sun,
  ClipboardList,
  MessageSquare,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      LayoutDashboard,
      Users,
      BookOpen,
      GraduationCap,
      Mail,
      LogOut,
      Moon,
      Sun,
      ClipboardList,
      MessageSquare,
    }),
  ],
  exports: [LucideAngularModule],
})
export class AdminLucideIconsModule {}
