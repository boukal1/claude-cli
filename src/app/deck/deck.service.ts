import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { SlideConfig } from './slide-config';

/** DI token for the slide data — makes `DeckService` trivially testable with fakes. */
export const DECK_SLIDES = new InjectionToken<readonly SlideConfig[]>('DECK_SLIDES');

/**
 * Source of truth for deck navigation state — current index, total, current
 * slide, fullscreen flag. Implemented with signals; no RxJS.
 */
@Injectable({ providedIn: 'root' })
export class DeckService {
  private readonly slides = inject(DECK_SLIDES);

  private readonly _currentIndex = signal(0);
  private readonly _fullscreen = signal(false);

  /** 0-based current slide index, clamped to [0, total-1]. */
  readonly currentIndex = this._currentIndex.asReadonly();
  /** Total number of slides including FAQ. */
  readonly total = computed(() => this.slides.length);
  /** The slide config currently displayed, or `undefined` if the deck is empty. */
  readonly current = computed(() => this.slides[this._currentIndex()]);
  /** Whether the deck is currently in fullscreen mode. */
  readonly fullscreen = this._fullscreen.asReadonly();

  /** Advance one slide forward, bounded at the last index. */
  next(): void {
    this._currentIndex.update((i) => Math.min(i + 1, this.slides.length - 1));
  }

  /** Move one slide back, bounded at 0. */
  prev(): void {
    this._currentIndex.update((i) => Math.max(i - 1, 0));
  }

  /**
   * Jump to an arbitrary slide index. Out-of-range values are clamped.
   *
   * @param index 0-based slide index
   */
  goTo(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.slides.length - 1));
    this._currentIndex.set(clamped);
  }

  /** Jump to the first main-group slide. */
  first(): void {
    const idx = this.slides.findIndex((s) => (s.group ?? 'main') === 'main');
    this._currentIndex.set(idx < 0 ? 0 : idx);
  }

  /** Jump to the last main-group slide (ignores FAQ slides at the end). */
  last(): void {
    const mains: number[] = [];
    this.slides.forEach((s, i) => {
      if ((s.group ?? 'main') === 'main') {
        mains.push(i);
      }
    });
    this._currentIndex.set(mains.length ? mains[mains.length - 1] : this.slides.length - 1);
  }

  /**
   * Jump to a specific FAQ slide by its index within the FAQ group.
   *
   * @param faqIndex 0-based index among FAQ slides
   */
  jumpToFaq(faqIndex: number): void {
    const faqIndices: number[] = [];
    this.slides.forEach((s, i) => {
      if (s.group === 'faq') {
        faqIndices.push(i);
      }
    });
    if (faqIndices.length === 0) {
      return;
    }
    const clamped = Math.max(0, Math.min(faqIndex, faqIndices.length - 1));
    this._currentIndex.set(faqIndices[clamped]);
  }

  /** Toggle the fullscreen signal; the caller must also call `requestFullscreen`. */
  toggleFullscreen(): void {
    this._fullscreen.update((v) => !v);
  }
}
