import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeckService } from './deck.service';
import {
  CodeSlideConfig,
  ContentSlideConfig,
  DemoCueSlideConfig,
  FaqSlideConfig,
  PrincipleSlideConfig,
  TerminalSlideConfig,
  TitleSlideConfig,
} from './slide-config';
import { TitleSlideComponent } from './layouts/title-slide.component';
import { ContentSlideComponent } from './layouts/content-slide.component';
import { PrincipleSlideComponent } from './layouts/principle-slide.component';
import { CodeSlideComponent } from './layouts/code-slide.component';
import { TerminalSlideComponent } from './layouts/terminal-slide.component';
import { DemoCueSlideComponent } from './layouts/demo-cue-slide.component';
import { FaqSlideComponent } from './layouts/faq-slide.component';

/**
 * Route-bound host. Reads the `:index` route parameter, keeps `DeckService` in
 * sync, and renders the layout component matching the current slide's `kind`.
 */
@Component({
  selector: 'app-slide-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleSlideComponent,
    ContentSlideComponent,
    PrincipleSlideComponent,
    CodeSlideComponent,
    TerminalSlideComponent,
    DemoCueSlideComponent,
    FaqSlideComponent,
  ],
  template: `
    @switch (slide().kind) {
      @case ('title') {
        <app-title-slide [slide]="asTitle(slide())" />
      }
      @case ('content') {
        <app-content-slide [slide]="asContent(slide())" />
      }
      @case ('principle') {
        <app-principle-slide [slide]="asPrinciple(slide())" />
      }
      @case ('code') {
        <app-code-slide [slide]="asCode(slide())" />
      }
      @case ('terminal') {
        <app-terminal-slide [slide]="asTerminal(slide())" />
      }
      @case ('demo-cue') {
        <app-demo-cue-slide [slide]="asDemoCue(slide())" />
      }
      @case ('faq') {
        <app-faq-slide [slide]="asFaq(slide())" />
      }
    }
  `,
  styles: [
    `
      :host {
        display: block;
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

    effect(() => {
      const i = this.deck.currentIndex();
      const current = this.route.snapshot.paramMap.get('index');
      if (current !== String(i)) {
        this.router.navigate(['/slide', i], { replaceUrl: false });
      }
    });
  }

  /**
   * Narrowing helpers — the `@switch` already verifies `slide.kind`, but
   * TypeScript can't propagate that guard into the `[slide]` binding. These
   * casts let the templates pass a strongly-typed config to each layout.
   */
  asTitle(s: ReturnType<typeof this.slide>): TitleSlideConfig {
    return s as TitleSlideConfig;
  }
  asContent(s: ReturnType<typeof this.slide>): ContentSlideConfig {
    return s as ContentSlideConfig;
  }
  asPrinciple(s: ReturnType<typeof this.slide>): PrincipleSlideConfig {
    return s as PrincipleSlideConfig;
  }
  asCode(s: ReturnType<typeof this.slide>): CodeSlideConfig {
    return s as CodeSlideConfig;
  }
  asTerminal(s: ReturnType<typeof this.slide>): TerminalSlideConfig {
    return s as TerminalSlideConfig;
  }
  asDemoCue(s: ReturnType<typeof this.slide>): DemoCueSlideConfig {
    return s as DemoCueSlideConfig;
  }
  asFaq(s: ReturnType<typeof this.slide>): FaqSlideConfig {
    return s as FaqSlideConfig;
  }
}
