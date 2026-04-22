import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeckService } from './deck.service';

/**
 * Route-bound host. Reads the `:index` route parameter, keeps `DeckService` in
 * sync, and renders a placeholder for the current slide (layout components are
 * wired in Phase 4).
 */
@Component({
  selector: 'app-slide-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (slide()?.kind) {
      @case ('title') {
        <p>TODO: TitleSlide — Task 4.1</p>
      }
      @case ('content') {
        <p>TODO: ContentSlide — Task 4.2</p>
      }
      @case ('principle') {
        <p>TODO: PrincipleSlide — Task 4.3</p>
      }
      @case ('code') {
        <p>TODO: CodeSlide — Task 4.4</p>
      }
      @case ('demo-cue') {
        <p>TODO: DemoCueSlide — Task 4.5</p>
      }
      @case ('faq') {
        <p>TODO: FaqSlide — Task 4.6</p>
      }
    }
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 4rem;
      }
    `,
  ],
})
export class SlideHostComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly deck = inject(DeckService);

  private readonly routeIndex = toSignal(this.route.paramMap, { requireSync: false });

  /** Current slide exposed to the template. */
  readonly slide = computed(() => this.deck.current());

  constructor() {
    // Route → service
    effect(() => {
      const params = this.routeIndex();
      if (!params) {
        return;
      }
      const raw = params.get('index');
      const parsed = raw === null ? 0 : Number.parseInt(raw, 10);
      if (Number.isFinite(parsed)) {
        this.deck.goTo(parsed);
      }
    });

    // Service → route (keep URL in sync with currentIndex)
    effect(() => {
      const i = this.deck.currentIndex();
      const current = this.route.snapshot.paramMap.get('index');
      if (current !== String(i)) {
        this.router.navigate(['/slide', i], { replaceUrl: false });
      }
    });
  }
}
