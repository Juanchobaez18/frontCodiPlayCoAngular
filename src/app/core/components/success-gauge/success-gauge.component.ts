import { AfterViewInit, Component, ElementRef, Input, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-success-gauge',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './success-gauge.component.html',
})
export class SuccessGaugeComponent implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input() percentage = 87;

  readonly doughnutType = 'doughnut' as const;
  doughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {};

  ngAfterViewInit(): void {
    const root = this.host.nativeElement.closest('.app-admin-root') ?? document.documentElement;
    const styles = getComputedStyle(root);
    const primary = styles.getPropertyValue('--primary').trim() || '#00e5a0';
    const secondary = styles.getPropertyValue('--secondary').trim() || '#00b4ff';
    const muted = styles.getPropertyValue('--muted').trim() || '#6b7280';

    const p = Math.max(0, Math.min(100, Math.round(this.percentage)));
    const inProg = Math.max(0, Math.min(100 - p, 8));
    const pend = Math.max(0, 100 - p - inProg);

    this.doughnutData = {
      labels: ['Completado', 'En progreso', 'Pendiente'],
      datasets: [
        {
          data: [p, inProg, pend],
          backgroundColor: [primary, secondary, `${muted}40`],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };

    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      animation: { animateRotate: true, animateScale: true, duration: 1100 },
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
    };
  }
}
