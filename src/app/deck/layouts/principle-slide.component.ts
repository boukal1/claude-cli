import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PrincipleSlideConfig } from '../slide-config';

/**
 * Principle / before-after slide — headline with one ❌ counter-example and
 * one ✅ good example, optionally followed by a single-sentence takeaway.
 */
@Component({
  selector: 'app-principle-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex h-screen max-w-5xl flex-col justify-center px-24">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h2 class="title">{{ slide().title }}</h2>
      <div class="pair">
        <div class="example bad">
          <span class="mark">✗</span>
          <span class="text">{{ slide().bad }}</span>
        </div>
        <div class="example good">
          <span class="mark">✓</span>
          <span class="text">{{ slide().good }}</span>
        </div>
      </div>
      @if (slide().takeaway) {
        <p class="takeaway">{{ slide().takeaway }}</p>
      }
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
      .pair {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .example {
        display: flex;
        gap: 0.9rem;
        align-items: baseline;
        padding: 0.9rem 1.1rem;
        font-family: var(--font-sans);
        font-size: clamp(0.95rem, 1.35vw, 1.1rem);
        line-height: 1.5;
      }
      .example.bad {
        border-left: 3px solid var(--color-coral);
      }
      .example.good {
        border-left: 3px solid var(--color-sage);
      }
      .mark {
        font-weight: 700;
        font-family: var(--font-mono);
      }
      .bad .mark {
        color: var(--color-coral);
      }
      .good .mark {
        color: var(--color-sage);
      }
      .takeaway {
        margin-top: 2rem;
        font-family: var(--font-sans);
        font-style: italic;
        color: var(--color-muted);
        max-width: 58ch;
      }
    `,
  ],
})
export class PrincipleSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<PrincipleSlideConfig>();
}
