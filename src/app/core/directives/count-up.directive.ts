import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnChanges, OnDestroy {
  /** Valor numérico final (animación desde 0). */
  @Input({ required: true }) appCountUp!: number;
  /** Duración total en ms (por defecto 1200). */
  @Input() countUpDuration = 1200;
  @Input() countUpDecimals = 0;
  @Input() countUpPrefix = '';
  @Input() countUpSuffix = '';

  private raf = 0;
  private startTs: number | null = null;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appCountUp'] || changes['countUpDuration']) {
      this.cancel();
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.cancel();
  }

  private cancel(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    this.startTs = null;
  }

  private start(): void {
    const end = Number.isFinite(this.appCountUp) ? this.appCountUp : 0;
    const duration = Math.max(1, this.countUpDuration);
    this.renderer.setProperty(this.el.nativeElement, 'textContent', this.compose(0));

    const tick = (now: number): void => {
      if (this.startTs === null) {
        this.startTs = now;
      }
      const t = Math.min(1, (now - this.startTs) / duration);
      const eased = easeOutQuad(t);
      const current = end * eased;
      const displayVal = t >= 1 ? end : current;
      this.renderer.setProperty(this.el.nativeElement, 'textContent', this.compose(displayVal));
      if (t < 1) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.raf = 0;
      }
    };

    this.raf = requestAnimationFrame(tick);
  }

  private compose(value: number): string {
    const n =
      this.countUpDecimals > 0
        ? value.toFixed(this.countUpDecimals)
        : Math.round(value).toString();
    return `${this.countUpPrefix}${n}${this.countUpSuffix}`;
  }
}
