import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DemoCueSlideConfig } from '../slide-config';

/**
 * Demo cue slide — full-bleed marker signalling the speaker to switch from
 * deck to terminal for a live demo segment.
 */
@Component({
  selector: 'app-demo-cue-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex h-screen flex-col items-center justify-center text-center">
      <div class="cue">{{ slide().cue }}</div>
      @if (slide().repoUrl; as url) {
        <a class="repo" [href]="'https://' + url" target="_blank" rel="noopener">{{ url }}</a>
      }
      @if (slide().speakerNote) {
        <p class="note">{{ slide().speakerNote }}</p>
      }
    </section>
  `,
  styles: [
    `
      .cue {
        font-family: var(--font-display);
        font-weight: 500;
        font-size: clamp(4rem, 12vw, 10rem);
        line-height: 1;
        color: var(--color-coral);
        letter-spacing: -0.03em;
      }
      .repo {
        margin-top: 2rem;
        font-family: var(--font-mono);
        font-size: clamp(1rem, 1.35vw, 1.3rem);
        color: var(--color-ink);
        background: rgba(200, 74, 42, 0.08);
        border: 1px solid rgba(200, 74, 42, 0.3);
        border-radius: 999px;
        padding: 0.5rem 1.25rem;
        text-decoration: none;
        transition:
          background 0.15s ease,
          border-color 0.15s ease;
      }
      .repo:hover {
        background: rgba(200, 74, 42, 0.15);
        border-color: rgba(200, 74, 42, 0.55);
      }
      .note {
        margin-top: 1.5rem;
        font-family: var(--font-sans);
        color: var(--color-muted);
        font-size: 1.2rem;
        max-width: 40ch;
      }
    `,
  ],
})
export class DemoCueSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<DemoCueSlideConfig>();
}
