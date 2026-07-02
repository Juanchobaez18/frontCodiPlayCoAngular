import { Component, Input } from '@angular/core';
import { TrendingUp } from 'lucide-angular';
import type { LucideIconData } from 'lucide-angular';
import { CountUpDirective } from '../../directives/count-up.directive';
import { AdminLucideIconsModule } from '../admin-lucide-icons.module';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [AdminLucideIconsModule, CountUpDirective],
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) countValue!: number;
  @Input({ required: true }) trendLabel!: string;
  @Input() trendTone: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input({ required: true }) icon!: LucideIconData;
  @Input() iconWrapClass = 'bg-primary/15 text-primary';
  @Input() countPrefix = '';
  @Input() countSuffix = '';
  @Input() countDecimals = 0;
  @Input() enterDelayMs = 0;

  protected readonly iTrend = TrendingUp;

  protected trendClass(): string {
    switch (this.trendTone) {
      case 'secondary':
        return 'text-secondary';
      case 'tertiary':
        return 'text-tertiary';
      default:
        return 'text-primary';
    }
  }
}

