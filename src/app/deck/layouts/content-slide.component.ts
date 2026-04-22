import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentSlideConfig } from '../slide-config';

/**
 * Generic bullet slide — headline followed by 2–4 short bullet points,
 * each prefixed with a coral em-dash.
 */
@Component({
  selector: 'app-content-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex h-screen max-w-4xl flex-col justify-center px-24">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h2 class="title">{{ slide().title }}</h2>
      <ul class="bullets">
        @for (b of slide().bullets; track b) {
          <li>{{ b }}</li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 500;
        letter-spacing: -0.015em;
        line-height: 1.1;
        margin: 0 0 2rem 0;
      }
      .bullets {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        font-family: var(--font-sans);
        font-size: clamp(1rem, 1.5vw, 1.25rem);
        line-height: 1.5;
      }
      .bullets li {
        padding-left: 1.5rem;
        position: relative;
      }
      .bullets li::before {
        content: '—';
        position: absolute;
        left: 0;
        color: var(--color-coral);
      }
    `,
  ],
})
export class ContentSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<ContentSlideConfig>();
}
