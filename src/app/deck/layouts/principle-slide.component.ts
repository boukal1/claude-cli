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
      @if (slide().demo; as demo) {
        <div class="demo">
          <div class="demo-line demo-prompt">
            <span class="prompt-caret">&gt;</span>
            <span class="prompt-cmd">{{ demo.command }}</span>
          </div>
          @for (line of demo.output; track $index) {
            <div class="demo-line demo-out">{{ line }}</div>
          }
        </div>
      }
      @if (slide().takeaway) {
        <p class="takeaway">{{ slide().takeaway }}</p>
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
        font-size: clamp(2.5rem, 4.75vw, 3.5rem);
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
        font-size: clamp(1.15rem, 1.6vw, 1.35rem);
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
      .demo {
        margin-top: 1.5rem;
        background: #0c0c0c;
        border-radius: 8px;
        padding: 1rem 1.3rem;
        font-family: var(--font-mono);
        font-size: clamp(0.9rem, 1.1vw, 1.05rem);
        line-height: 1.55;
        color: rgba(230, 230, 230, 0.85);
        max-width: 56rem;
        box-shadow: 0 10px 25px -12px rgba(0, 0, 0, 0.25);
      }
      .demo-line {
        white-space: pre;
      }
      .demo-prompt {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }
      .prompt-caret {
        color: var(--color-coral);
        font-weight: 600;
      }
      .prompt-cmd {
        color: #ffffff;
      }
      .demo-out {
        color: rgba(230, 230, 230, 0.72);
      }
      .takeaway {
        margin-top: 1.5rem;
        font-family: var(--font-sans);
        font-style: italic;
        font-size: clamp(1rem, 1.25vw, 1.2rem);
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
