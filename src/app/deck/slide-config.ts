/**
 * Describes one slide's content and which layout component renders it.
 *
 * Slides are stored in `slides.data.ts` as `SlideConfig[]`. Each config has a
 * `kind` discriminator that a host component uses to pick the matching layout.
 */
export type SlideConfig =
  | TitleSlideConfig
  | ContentSlideConfig
  | PrincipleSlideConfig
  | CodeSlideConfig
  | TerminalSlideConfig
  | DemoCueSlideConfig
  | FaqSlideConfig;

/** Marker applied to FAQ slides so they can be filtered out of the main flow. */
export type SlideGroup = 'main' | 'faq';

/**
 * Fields shared by every slide variant — the discriminator, an optional label,
 * and the group this slide belongs to.
 */
export interface BaseSlide {
  /** Kind discriminator — picks the layout component. */
  readonly kind: SlideConfig['kind'];
  /** Small uppercased label shown above the title (e.g. "Bien prompter · 1/4"). */
  readonly label?: string;
  /** Which group the slide belongs to — `faq` slides are jumpable via shortcut. */
  readonly group?: SlideGroup;
}

/**
 * Act-opener or section-title slide — large display headline with optional subtitle.
 */
export interface TitleSlideConfig extends BaseSlide {
  readonly kind: 'title';
  /** Display title, rendered in the display serif. */
  readonly title: string;
  /** Optional subtitle below the title. */
  readonly subtitle?: string;
  /** When true, render the Claude sparkle logo above the label — reserved for the opening slide. */
  readonly logo?: boolean;
}

/**
 * Generic bullet slide — headline followed by 2–4 short bullet points.
 */
export interface ContentSlideConfig extends BaseSlide {
  readonly kind: 'content';
  readonly title: string;
  /** 2–4 bullets shown below the title. */
  readonly bullets: readonly string[];
}

/**
 * Principle / before-after slide — one ❌ counter-example and one ✅ good example,
 * optionally followed by a compact terminal demo and a single-sentence takeaway.
 */
export interface PrincipleSlideConfig extends BaseSlide {
  readonly kind: 'principle';
  /** Short, punchy headline for the principle. */
  readonly title: string;
  /** ❌ anti-example — what a newbie would say. */
  readonly bad: string;
  /** ✅ good example — how they should say it instead. */
  readonly good: string;
  /** Optional one-sentence takeaway below the examples. */
  readonly takeaway?: string;
  /** Optional terminal demo rendered between the good example and the takeaway. */
  readonly demo?: PrincipleDemo;
}

/**
 * Compact terminal demo embedded inside a principle slide — shows the command
 * the user types followed by a fabricated but representative CLI response.
 */
export interface PrincipleDemo {
  /** The command the user types at the prompt (e.g., `/init`). */
  readonly command: string;
  /** Output lines rendered below the command, preserved as-is with spacing. */
  readonly output: readonly string[];
}

/**
 * Code-block slide — horizontally-centered, max-width-constrained, with caption.
 */
export interface CodeSlideConfig extends BaseSlide {
  readonly kind: 'code';
  readonly title: string;
  /** Code block contents — preserve leading whitespace as-is. */
  readonly code: string;
  /** highlight.js language hint (e.g. `bash`, `typescript`, `markdown`). */
  readonly language: string;
  /** Small caption below the code block. */
  readonly caption?: string;
}

/**
 * Windows Terminal preview — renders a chromed terminal window mock with a
 * PowerShell prompt, the invoked command, and Claude's welcome banner. Used to
 * show what the audience will actually see when running `claude` for the first
 * time.
 */
export interface TerminalSlideConfig extends BaseSlide {
  readonly kind: 'terminal';
  /** Large headline above the terminal frame. */
  readonly title: string;
  /** Label shown in the fake window title bar (default: "Windows PowerShell"). */
  readonly titleBar?: string;
  /** Current working directory shown in the PowerShell prompt and welcome box. */
  readonly cwd: string;
  /** Command typed after the prompt (typically `claude`). */
  readonly command: string;
  /** Optional caption rendered below the terminal frame. */
  readonly caption?: string;
  /**
   * Optional transcript lines rendered after the command. When provided, the
   * Claude welcome banner is hidden and these lines are shown as the terminal
   * response — use this for install flows, one-off command demos, etc. When
   * omitted, the component renders the default Claude welcome banner.
   */
  readonly output?: readonly string[];
}

/**
 * Demo cue — a minimal full-bleed marker that signals the speaker to switch to
 * the terminal for a live demo segment.
 */
export interface DemoCueSlideConfig extends BaseSlide {
  readonly kind: 'demo-cue';
  /** Large cue text, e.g. "→ Démo live". */
  readonly cue: string;
  /** Optional speaker-facing note shown below, smaller. */
  readonly speakerNote?: string;
}

/**
 * FAQ slide — a pre-written question-and-answer reachable via the FAQ shortcut.
 */
export interface FaqSlideConfig extends BaseSlide {
  readonly kind: 'faq';
  /** Question as the headline. */
  readonly question: string;
  /** Short paragraph answer — keep under ~40 words. */
  readonly answer: string;
}
