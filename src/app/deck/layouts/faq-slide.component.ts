import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaqSlideConfig } from '../slide-config';

/**
 * FAQ slide — a pre-written question-and-answer reachable via the `Q` + digit
 * shortcut rather than sequential navigation.
 */
@Component({
  selector: 'app-faq-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex h-screen max-w-4xl flex-col justify-center px-24">
      <div class="label">FAQ</div>
      <h2 class="question">{{ slide().question }}</h2>
      <p class="answer">{{ slide().answer }}</p>
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-coral);
        margin-bottom: 1rem;
        font-weight: 600;
      }
      .question {
        font-family: var(--font-display);
        font-weight: 500;
        font-size: clamp(2.25rem, 4vw, 3.25rem);
        line-height: 1.15;
        letter-spacing: -0.015em;
        margin: 0 0 1.75rem 0;
      }
      .answer {
        font-family: var(--font-sans);
        font-size: clamp(1.2rem, 1.65vw, 1.4rem);
        line-height: 1.55;
        max-width: 58ch;
        color: var(--color-ink);
      }
    `,
  ],
})
export class FaqSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<FaqSlideConfig>();
}
