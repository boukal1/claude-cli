import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeckService } from './deck/deck.service';

/**
 * Root component — owns global keyboard shortcuts and hosts the router outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly deck = inject(DeckService);

  /** Whether the shortcut-reference overlay is currently visible. */
  readonly showShortcuts = signal(false);
  /** FAQ mode: when pressed, the next digit key (1-9) jumps to that FAQ slide. */
  private readonly waitingForFaqDigit = signal(false);

  /**
   * Handles global navigation keys. Ignored when focus is inside an editable
   * element so that future `<input>`-bearing slides keep working.
   *
   * @param event the raw keyboard event from the window-level listener
   */
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
    ) {
      return;
    }

    if (this.waitingForFaqDigit()) {
      const digit = Number.parseInt(event.key, 10);
      if (Number.isFinite(digit) && digit >= 1 && digit <= 9) {
        this.deck.jumpToFaq(digit - 1);
        this.waitingForFaqDigit.set(false);
        event.preventDefault();
        return;
      }
      this.waitingForFaqDigit.set(false);
    }

    switch (event.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        this.deck.next();
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        this.deck.prev();
        event.preventDefault();
        break;
      case 'Home':
        this.deck.first();
        event.preventDefault();
        break;
      case 'End':
        this.deck.last();
        event.preventDefault();
        break;
      case 'f':
      case 'F':
        void this.toggleFullscreen();
        event.preventDefault();
        break;
      case '?':
        this.showShortcuts.update((v) => !v);
        event.preventDefault();
        break;
      case 'q':
      case 'Q':
        this.waitingForFaqDigit.set(true);
        event.preventDefault();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        }
        this.showShortcuts.set(false);
        this.waitingForFaqDigit.set(false);
        break;
    }
  }

  private async toggleFullscreen(): Promise<void> {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
    this.deck.toggleFullscreen();
  }
}
