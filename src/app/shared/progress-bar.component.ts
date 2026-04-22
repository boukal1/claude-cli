import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DeckService } from '../deck/deck.service';

/**
 * Thin coral bar fixed to the top of the viewport, filling from left to right
 * as the deck advances through its slides.
 */
@Component({
  selector: 'app-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="bar" [style.width.%]="percent()"></div>`,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(46, 29, 16, 0.08);
        z-index: 50;
      }
      .bar {
        height: 100%;
        background: var(--color-coral);
        transition: width 250ms ease;
      }
    `,
  ],
})
export class ProgressBarComponent {
  private readonly deck = inject(DeckService);

  /** Current progress as a percentage of the deck length, 0–100. */
  readonly percent = computed(() => {
    const total = this.deck.total();
    if (total <= 1) {
      return 100;
    }
    return ((this.deck.currentIndex() + 1) / total) * 100;
  });
}
