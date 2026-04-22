import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TitleSlideConfig } from '../slide-config';

/**
 * Act-opener / section-title slide — large display headline with optional subtitle
 * and an uppercase label above the title.
 */
@Component({
  selector: 'app-title-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex h-screen max-w-5xl flex-col items-start justify-center px-24">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h1 class="title">{{ slide().title }}</h1>
      @if (slide().subtitle) {
        <p class="subtitle">{{ slide().subtitle }}</p>
      }
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 1.25rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-weight: 500;
        font-size: clamp(3.5rem, 8vw, 6.5rem);
        line-height: 1.05;
        letter-spacing: -0.02em;
        color: var(--color-ink);
        margin: 0;
      }
      .subtitle {
        font-family: var(--font-sans);
        font-size: clamp(1.375rem, 2vw, 1.75rem);
        color: var(--color-muted);
        margin-top: 1.5rem;
        max-width: 48ch;
        line-height: 1.4;
      }
    `,
  ],
})
export class TitleSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<TitleSlideConfig>();
}
