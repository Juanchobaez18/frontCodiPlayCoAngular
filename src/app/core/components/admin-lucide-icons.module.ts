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
    }),
  ],
  exports: [LucideAngularModule],
})
export class AdminLucideIconsModule {}
