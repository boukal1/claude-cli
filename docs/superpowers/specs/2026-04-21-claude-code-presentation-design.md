# Design — Présentation Claude Code pour collègues

**Date:** 2026-04-21
**Author:** ds@inser.ch (brainstorm with Claude Code)
**Status:** Design — pending implementation plan

## 1. Goal

Build a **live-talk presentation** that introduces Claude Code (the CLI coding agent) to fellow developers who have used ChatGPT/Copilot in a browser but have never driven a CLI-native agent. The deliverable is **two GitHub repositories**:

1. **`claude-cli`** — an Angular single-page app that functions as a keyboard-driven slide deck, deployed to GitHub Pages. This is both the live-talk canvas and the shareable takeaway cheat sheet.
2. **`claude-demo-playground`** — a small Angular app used as the repo cloned live during the demo segment (Act 4). Contains a seeded bug and a seeded TODO feature engineered for the narrative.

The meta-hook of the talk is that **both repos are built using Claude Code**, with the commit history shown on stage as proof at the end.

## 2. Audience & constraints

- **Audience:** fellow developers, new to Claude Code specifically. Familiar with browser-based AI tools (ChatGPT, Copilot), unfamiliar with CLI coding agents.
- **Format:** live in-person talk, ~30–40 minutes content, extendable to 60.
- **Language:** all slide content, README, FAQ, and seeded code comments in **French**. CLI commands, code keywords, terminal output, and proper nouns (Claude Code, plan mode, CLAUDE.md) stay in English.
- **Tone:** welcoming, newbie-friendly. Real Q&A buffer baked into the plan (~10 min of slack inside a 40-min slot). Avoid jargon without defining it once plainly.

## 3. Narrative spine

Five acts, ~30 min of content + ~10 min of slack for questions.

### Act 1 — Le hook *(~4 min)*

- **"Pourquoi un CLI ?"** ChatGPT lives in a browser tab and has no idea about *your* code. Claude Code lives in your repo — reads your files, runs your commands, learns your conventions. It's a colleague, not a clipboard.
- **Meta reveal:** *"Ces slides ont été construits avec Claude Code. Je vous montre le commit log à la fin."*

### Act 2 — La boucle de base *(~6 min)*

- One slide: install + launch (`npm install -g @anthropic-ai/claude-code`, then `claude` in any folder).
- **The five essentials:**
  1. `Shift+Tab` → plan mode (the single biggest unlock for newbies)
  2. `@file.ts` → point Claude at a specific file
  3. `#` → save a note to `CLAUDE.md` (project memory)
  4. `!command` → run a shell command inline
  5. `/clear` → reset context when it gets muddled
- **Signpost slide:** "Il y a plus — hooks, subagents, MCPs, slash commands, plugins… c'est un deuxième talk."

### Act 3 — Bien prompter *(~8 min)* — the sticky part

Four principles, one `❌` vs `✅` before-after example each. Examples use Java / Angular vocabulary.

1. **Un objectif, pas une tâche.** Give a concrete goal with acceptance criteria, not a vague command.
2. **Contexte, pas solution.** Hand over the relevant files and a style reference. Don't prescribe the implementation.
3. **Plan mode pour tout ce qui est non-trivial.** Let Claude propose, you approve, then execute. Costs 30 seconds, saves 30 minutes.
4. **Vérifier avant de faire confiance.** Claude says "done, all tests pass." Run the tests yourself. It's a brilliant junior, not an oracle.

### Act 4 — Démo live *(~8 min, expandable to ~15)*

Live on `claude-demo-playground` (cloned fresh on stage).

1. **"What does this do?"** — Claude orients itself in unfamiliar code.
2. **Plan + fix the failing test** — prompt → plan mode → approve → green.
3. **(Stretch, if C-slot)** Add the filter-by-status feature via plan mode.

**One honest moment required:** Claude's first attempt at the bug is slightly wrong (fixes the symptom but not the immutability root cause). The speaker then course-corrects with more context. Colleagues need to see the correction loop to trust the claim that it works.

### Act 5 — Meta reveal & takeaways *(~3 min)*

- Terminal: `git log --oneline` on *this very deck's* repo, scrolled live.
- **Three things to try Monday:** (1) drop a `CLAUDE.md` in your current repo with 3 conventions, (2) next ticket → plan mode first, (3) next file-editing prompt → start with `@`.
- Cheat sheet URL = the deployed deck.

### FAQ appendix *(jumpable via keyboard shortcut)*

Four Q&A slides for expected interrupting questions:

1. *C'est safe avec notre code privé ?* (data / privacy posture)
2. *Ça marche avec IntelliJ / VS Code ?* (IDE integrations — Claude Code extensions exist)
3. *On peut le brancher sur Jira / Confluence ?* (MCP framing, one-sentence answer)
4. *Et GitHub Copilot, on garde ou on jette ?* (positioning — they're complementary, different shapes)

## 4. Visual style — "Anthropic-inspired"

- **Background:** cream `#f5efe4` (primary slide surface)
- **Text:** deep ink `#2e1d10`
- **Accents:** coral `#c84a2a` for emphasis and the ❌ marker, sage `#7a8c5a` for the ✅ marker
- **Display font:** `Crimson Pro` (serif, for headlines and act titles) via Google Fonts
- **Body font:** `Inter` (sans-serif) for body copy, labels, code captions
- **Labels:** small uppercase, letter-spaced, muted `#8c6f54`
- **Code blocks:** dark monospace treatment on the cream background — inverted contrast, subtle rounded corners
- **Motion:** minimal — fade transitions between slides, no slide-slide-slide animations

Rationale: warm, premium, editorial — signals "thoughtful talk" and echoes the Anthropic brand language colleagues will encounter if they visit claude.com afterward.

## 5. `claude-cli` — Angular slide deck architecture

### Tech stack

- **Angular 21** — standalone components (default), signals, new control flow (`@if`/`@for`/`@switch`), zoneless by default. No NgModules.
- **Tailwind CSS v4** — via `@tailwindcss/postcss`. CSS-first config: theme tokens (`cream`, `ink`, `coral`, `sage`, typography stack) declared with the `@theme` directive in `styles.css`, not a JS config file. `@import "tailwindcss"` is the only import needed.
- **`ngx-highlightjs`** (Angular 21-compatible release) for syntax highlighting in `CodeSlide`. If incompatible at time of scaffolding, fall back to `prismjs` — same shape, different import.
- **`angular-cli-ghpages`** for one-command deploy to GitHub Pages.
- **Google Fonts** (`Crimson Pro` + `Inter`) loaded in `index.html`.

### Slide model: layouts + data

Six slide layout components, with slide content as a typed array in `slides.data.ts`.

| Layout component | Use case |
|---|---|
| `TitleSlide` | Act openers ("Bien prompter") |
| `ContentSlide` | Headline + 2–4 bullets |
| `PrincipleSlide` | Headline + ❌/✅ before-after example |
| `CodeSlide` | Horizontally-centered, max-width-constrained code block with caption below |
| `DemoCueSlide` | Minimal marker ("→ Démo live") to cue the speaker to switch to terminal |
| `FaqSlide` | Question headline + concise answer |

Adding a slide = 3 lines in `slides.data.ts`, no component scaffolding.

### Folder layout

```
src/app/
├── app.component.ts              // root — keyboard handler, progress bar, routing outlet
├── app.config.ts                 // providers (highlight, router)
├── deck/
│   ├── deck.service.ts           // signals: currentIndex, total, fullscreen, faqMode
│   ├── slides.data.ts            // the talk content (French) as SlideConfig[]
│   ├── slide-config.ts           // SlideConfig discriminated union
│   └── layouts/
│       ├── title-slide.component.ts
│       ├── content-slide.component.ts
│       ├── principle-slide.component.ts
│       ├── code-slide.component.ts
│       ├── demo-cue-slide.component.ts
│       └── faq-slide.component.ts
└── shared/
    ├── terminal-frame.component.ts   // styled "terminal window" wrapper for screenshots on slides
    ├── progress-bar.component.ts     // thin bar at top showing talk progress
    └── key-hint.component.ts         // bottom-right shortcuts hint (← → F ?)
```

### State

All state via Angular signals — no RxJS for deck logic.

```ts
@Injectable({ providedIn: 'root' })
export class DeckService {
  readonly currentIndex = signal(0);
  readonly total = computed(() => SLIDES.length);
  readonly current = computed(() => SLIDES[this.currentIndex()]);
  readonly fullscreen = signal(false);
  readonly faqMode = signal(false);

  next(): void { /* bounded increment */ }
  prev(): void { /* bounded decrement */ }
  goTo(i: number): void { /* bounded set */ }
  toggleFullscreen(): void { /* requestFullscreen / exitFullscreen */ }
  jumpToFaq(index: number): void { /* go to FAQ slide by index */ }
}
```

### Routing

Single parameterized route `/slide/:index` (0-based). Deep-linkable. Refresh stays on current slide.

### Keyboard map

| Key | Action |
|---|---|
| `→` / `Space` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Home` / `End` | First / last content slide |
| `F` | Toggle fullscreen |
| `?` | Overlay with shortcut reference |
| `Q` then `1`–`4` | Jump to FAQ slide |
| `Esc` | Exit fullscreen / close overlay |

Presenter mode is explicitly out of scope (see §8).

### Build & deploy

- `npm run build` → `dist/`
- `npm run deploy` → pushes to `gh-pages` branch via `angular-cli-ghpages` with `--base-href /claude-cli/`
- Public URL: `https://<github-username>.github.io/claude-cli/`

## 6. `claude-demo-playground` — demo repo

### Tech stack

Angular 21 standalone app, same major version as the deck. Single screen: a task tracker ("Carnet de missions").

### App shape — "Carnet de missions"

One component shows a list of missions, each with a title, status, and a "marquer terminée" toggle. ~8 files, ~250 lines total. Kept deliberately small so colleagues can navigate the whole repo in 30 seconds.

### Folder layout

```
claude-demo-playground/
├── CLAUDE.md                       // conventions in French
├── README.md                       // in French — explains the scenario for future readers
├── .editorconfig
├── .prettierrc                     // Prettier config (seeded)
├── .github/workflows/ci.yml        // runs lint + tests on push — provides the README badge
├── package.json, angular.json, tsconfig.json
└── src/app/
    ├── app.component.ts            // root, composes mission-list
    ├── mission.model.ts            // Mission type + MissionStatus enum
    ├── mission.service.ts          // SEEDED BUG in toggleComplete()
    ├── mission.service.spec.ts     // failing test exposing the bug
    └── mission-list/
        ├── mission-list.component.ts
        ├── mission-list.component.html   // contains the `<!-- TODO -->` comment
        └── mission-list.component.scss
```

The README displays a CI status badge at the top. Colleagues browsing the repo post-talk see it in both states: red (bug still present on `main`) then green (after the speaker pushes the fix) — a visible artifact of the talk's narrative.

### Seeded bug — `MissionService.toggleComplete(id)`

The method mutates the existing mission object in place instead of returning a new array with a new object for the toggled mission. With `ChangeDetectionStrategy.OnPush` on `MissionListComponent`, Angular never re-renders. The UI button clicks but the status never visually flips.

**Failing test:** `'toggleComplete should flip the completed flag on the matching mission'` fails with a misleading message — the assertion is on the signal-returned array identity, not the field value, so the error message doesn't obviously point at immutability.

**Why engineered this way:**
- Plausible-but-wrong naïve fix: flip the boolean in place "harder." Tests still fail. This is **the honest moment** the talk requires.
- Correct fix with `CLAUDE.md` context loaded: Claude reads the "no mutation" convention and uses `.map()` to return a new array with a new object.
- Real-world Angular gotcha — lands with a senior Angular audience.

### Seeded TODO

`mission-list.component.html` contains:

```html
<!-- TODO: ajouter un filtre par statut (toutes / actives / terminées) -->
```

Demo move: engage plan mode, ask Claude to add the filter. Touches 3 files (component, template, service signal). ~2 min with plan mode showing the propose → approve → execute loop.

### Seeded `CLAUDE.md` (in French)

```markdown
# Carnet de missions — conventions

- Angular 21+, standalone components, signals pour l'état, zoneless
- OnPush partout — pas de mutation d'état, toujours retourner de nouveaux objets/arrays
- Tests avec Vitest + jsdom, un `describe` par service/component
- Pas de `any` en TypeScript — types explicites
- Textes en français, identifiants en anglais
```

Shown on a slide beforehand. Pays off during the demo: the correct fix honors "no mutation," landing the prompting-principles lesson in real time.

### CI

Single GitHub Actions workflow `.github/workflows/ci.yml`: installs deps, runs `ng lint` (requires `@angular-eslint/schematics` to be added during project scaffolding — Angular 17+ ships without a default linter) and `ng test --watch=false --browsers=ChromeHeadless`. Triggers on `push` to `main` and on `pull_request`.

The README badge is GitHub Actions' own workflow status badge (`.github/workflows/ci.yml/badge.svg`) — not generated by the tests themselves. The repo ships with the seeded bug, so CI is red at import time; it turns green once the speaker pushes the fix (typically post-talk, not during the live demo, to avoid the latency of a push-during-stage moment).

## 7. Hosting

- Both repos on **GitHub** under the user's personal account.
- Local layout: `C:\Projects\claude-cli\` (deck) and `C:\Projects\claude-demo-playground\` (demo), sibling folders.
- During the live demo, the speaker runs `git clone https://github.com/<user>/claude-demo-playground` in a temp dir — this is the "real fresh clone" ceremony for the audience.

## 8. Non-goals / out of scope

Explicitly **not** building:

- **Presenter mode** (second-screen view with notes, timer, next-slide preview) — nice-to-have, not needed for a competent talk.
- **Interactive fake-terminal emulator** on slides where colleagues can type commands — originally mentioned in brainstorming, cut to keep scope honest.
- **A dedicated async-browsing long-scroll layout** — the deck will be readable as a deployed URL, but the primary UX is keyboard-driven slides, not an article.
- **Teaching content on:** hooks, subagents, MCP servers, custom slash commands, plugins, thinking mode, Claude Code enterprise features. All signposted in a single "there's more" slide at the end of Act 2.
- **`.superpowers/brainstorm/`** artifacts — added to `.gitignore` before the first commit, not shipped.
- **Pricing / plans discussion** — explicitly removed from the FAQ at the user's request.

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Live demo fails on stage (network, Claude down, unexpected prompt failure) | Pre-record a fallback asciinema of the same demo; keep it one keypress away from the current slide. Decide day-of whether to go live or recorded. |
| 40-min slot overruns because of Q&A | Content is paced to 30 min. FAQ appendix slides answer the common questions in ~30 sec each so speaker can short-circuit discussion when time is tight. |
| `CLAUDE.md` convention about "no mutation" doesn't fire — Claude's fix is still wrong | Test the scenario end-to-end *before* the talk with the exact seeded `CLAUDE.md`. If it's flaky, strengthen the convention wording. |
| Audience sees immutability bug as "Angular trivia" rather than a prompting lesson | Speaker explicitly narrates: *"voyez comment la convention dans `CLAUDE.md` a guidé Claude vers la bonne solution."* Lesson is named, not left implicit. |

## 10. Deliverables checklist

When this project is "done":

- [ ] `claude-cli` GitHub repo created, deployed to GitHub Pages, accessible at a public URL
- [ ] Deck contains all slides across Acts 1–5 + FAQ appendix, in French, in the Anthropic-inspired visual style
- [ ] All six slide layouts implemented and exercised by real slides
- [ ] Keyboard navigation + fullscreen + shortcut overlay working
- [ ] `claude-demo-playground` GitHub repo created with the seeded bug, failing test, TODO, `CLAUDE.md`, Prettier config, CI workflow, and README (French) with CI badge
- [ ] End-to-end rehearsal done: speaker runs the full Act 4 demo on the seeded repo and confirms the honest-moment scenario reproduces reliably
- [ ] `.superpowers/` in both repos' `.gitignore` before first commit
