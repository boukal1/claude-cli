import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Modal overlay listing every keyboard shortcut the deck responds to. Shown
 * when the user presses `?`, dismissed by clicking the backdrop or pressing
 * `Escape`/`?` again.
 */
@Component({
  selector: 'app-shortcuts-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <button
        type="button"
        class="backdrop"
        aria-label="Fermer"
        (click)="dismissed.emit()"
      ></button>
      <div class="panel" role="dialog" aria-labelledby="sc-title">
        <h2 id="sc-title">Raccourcis</h2>
        <dl>
          <dt>← / →</dt>
          <dd>Slide précédente / suivante</dd>
          <dt>Espace / PageDown</dt>
          <dd>Slide suivante</dd>
          <dt>Home / End</dt>
          <dd>Première / dernière slide</dd>
          <dt>F</dt>
          <dd>Plein écran</dd>
          <dt>Q puis 1–4</dt>
          <dd>Sauter vers une FAQ</dd>
          <dt>?</dt>
          <dd>Afficher / cacher cette aide</dd>
          <dt>Échap</dt>
          <dd>Sortir du plein écran / fermer</dd>
        </dl>
      </div>
    }
  `,
  styles: [
    `
      .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(46, 29, 16, 0.45);
        z-index: 60;
        border: none;
        padding: 0;
        cursor: pointer;
      }
      .panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-cream);
        color: var(--color-ink);
        padding: 2rem 2.25rem;
        border-radius: 8px;
        z-index: 61;
        min-width: 420px;
        max-width: 90vw;
        box-shadow: 0 20px 40px rgba(46, 29, 16, 0.25);
        font-family: var(--font-sans);
      }
      h2 {
        font-family: var(--font-display);
        font-weight: 500;
        font-size: 1.5rem;
        margin: 0 0 1.25rem 0;
      }
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.5rem 1.5rem;
        margin: 0;
        font-size: 0.9rem;
      }
      dt {
        font-weight: 600;
        color: var(--color-coral);
      }
      dd {
        margin: 0;
      }
    `,
  ],
})
export class ShortcutsOverlayComponent {
  /** Whether the overlay is currently visible. */
  readonly visible = input.required<boolean>();
  /** Fired when the user clicks the backdrop to dismiss the overlay. */
  readonly dismissed = output<void>();
}
