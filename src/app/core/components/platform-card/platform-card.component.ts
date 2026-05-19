import { AfterViewInit, Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-platform-card',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './platform-card.component.html',
})
export class PlatformCardComponent implements AfterViewInit {
  @Input({ required: true }) cursosActivos!: number;
  @Input({ required: true }) docentesActivos!: number;
  @Input({ required: true }) adminDisplayName!: string;

  readonly barType = 'bar' as const;
  barData: ChartData<'bar'> = { labels: [], datasets: [] };
  barOptions: ChartConfiguration<'bar'>['options'] = {};

  ngAfterViewInit(): void {
    this.barData = {
      labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          data: [42, 55, 38, 62, 48, 35, 58],
          backgroundColor: 'rgba(255,255,255,0.22)',
          borderColor: 'rgba(255,255,255,0.35)',
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(255,255,255,0.35)',
        },
      ],
    };

    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: 'rgba(255,255,255,0.88)', font: { size: 11 } },
        },
        y: {
          display: false,
          min: 0,
          max: 80,
        },
      },
    };
  }
}
