import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Discreet bottom-right hint line listing the primary keyboard shortcuts —
 * meant to reassure first-time visitors that the deck is keyboard-driven.
 */
@Component({
  selector: 'app-key-hint',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span>← →</span>
    <span class="dot">•</span>
    <span>F pour plein écran</span>
    <span class="dot">•</span>
    <span>? pour l'aide</span>
  `,
  styles: [
    `
      :host {
        position: fixed;
        bottom: 1rem;
        right: 1.25rem;
        z-index: 40;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        color: var(--color-muted);
        letter-spacing: 0.05em;
        display: flex;
        gap: 0.45rem;
        align-items: center;
      }
      .dot {
        opacity: 0.5;
      }
    `,
  ],
})
export class KeyHintComponent {}
