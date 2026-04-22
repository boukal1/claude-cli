import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { CodeSlideConfig } from '../slide-config';

/**
 * Code-block slide — horizontally-centered, max-width-constrained, syntax
 * highlighted via highlight.js.
 */
@Component({
  selector: 'app-code-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
  template: `
    <section class="mx-auto flex h-screen max-w-5xl flex-col justify-center px-24">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h2 class="title">{{ slide().title }}</h2>
      <pre class="code"><code [highlight]="slide().code" [language]="slide().language"></code></pre>
      @if (slide().caption) {
        <p class="caption">{{ slide().caption }}</p>
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
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-size: clamp(2.25rem, 3.75vw, 3rem);
        font-weight: 500;
        letter-spacing: -0.015em;
        margin: 0 0 1.5rem 0;
      }
      .code {
        background: #1a1a1a;
        color: #e6edf3;
        padding: 1.25rem 1.5rem;
        border-radius: 10px;
        font-family: var(--font-mono);
        font-size: clamp(1rem, 1.2vw, 1.15rem);
        line-height: 1.55;
        overflow-x: auto;
        max-width: 72ch;
      }
      .caption {
        margin-top: 1rem;
        font-family: var(--font-sans);
        color: var(--color-muted);
        font-size: 1.1rem;
        max-width: 72ch;
      }
    `,
  ],
})
export class CodeSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<CodeSlideConfig>();
}
