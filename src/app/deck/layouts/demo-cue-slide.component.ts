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
      .note {
        margin-top: 2.5rem;
        font-family: var(--font-sans);
        color: var(--color-muted);
        font-size: 1rem;
        max-width: 40ch;
      }
    `,
  ],
})
export class DemoCueSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<DemoCueSlideConfig>();
}
