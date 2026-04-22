# Claude Code Presentation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a live-talk presentation introducing Claude Code — an Angular 21 slide deck (deployed to GitHub Pages) plus a small Angular 21 demo repo used for the live-demo segment.

**Architecture:** Two independent GitHub repos. `claude-cli` is the slide deck — Angular 21 + Tailwind v4 + a layouts-plus-data slide model driven by signals and keyboard navigation. `claude-demo-playground` is a small task-tracker Angular app seeded with one realistic bug (mutation under `OnPush`) and one TODO feature, used live on stage.

**Tech Stack:** Angular 21 (standalone, signals, zoneless, `@if`/`@for`), TypeScript 5.x, Tailwind CSS v4 (CSS-first `@theme` config), `ngx-highlightjs` (fallback: `prismjs`), `angular-cli-ghpages` for deploy, Jasmine + Karma for tests, GitHub Actions for CI.

**Spec:** `docs/superpowers/specs/2026-04-21-claude-code-presentation-design.md`

**Prerequisites:** Node 20.11+ or 22+, a GitHub account (user has one), Chrome available for Karma headless tests.

**Language conventions:**

- Audience-facing text (slide copy, READMEs, FAQ answers, seeded code comments) in French.
- Code identifiers, CLI commands, terminal output, proper nouns (Claude Code, plan mode, CLAUDE.md) in English.
- JSDoc on every public method, type, and class per user's global CLAUDE.md conventions.

---

## Phase 0 — Pre-flight

### Task 0.1: Confirm prerequisites & working directories

**Files:** none (environment check)

- [ ] **Step 1: Confirm Node version**

Run: `node --version`
Expected: `v20.11.x` or higher, or `v22.x` or higher.

If older, install a recent Node via nvm / fnm / installer before proceeding.

- [ ] **Step 2: Confirm Angular CLI available**

Run: `npx -y @angular/cli@21 version`
Expected: prints Angular CLI 21.x version banner. `npx` is used here so the plan never relies on a globally-installed CLI.

- [ ] **Step 3: Confirm GitHub auth**

Run: `gh auth status`
Expected: `Logged in to github.com as <username>`.

If not authenticated: `gh auth login` — follow the interactive prompts. Ask the user before proceeding with any login interactively.

- [ ] **Step 4: Confirm working directories**

Run: `ls C:/Projects/` and verify:

- `C:/Projects/claude-cli/` exists (currently holds the spec; will become the deck repo)
- `C:/Projects/claude-demo-playground/` does not yet exist (created in Phase 1)

No commit this task — environment verification only.

---

## Phase 1 — `claude-demo-playground` (demo repo)

We build this repo first. It is smaller, sharper in purpose, and finishing it gives fast feedback before the larger deck.

### Task 1.1: Scaffold Angular 21 project

**Files:**

- Create: `C:/Projects/claude-demo-playground/` (entire Angular scaffold)

- [ ] **Step 1: Scaffold the project**

Run from `C:/Projects/`:

```bash
npx -y @angular/cli@21 new claude-demo-playground \
  --style=scss \
  --routing=false \
  --ssr=false \
  --strict=true \
  --skip-tests=false \
  --package-manager=npm \
  --skip-git=false
```

Expected: prompts may appear for "share analytics" (answer `N`) and "server-side rendering" (already set to `false`). Installation runs; finishes with "Successfully created …".

- [ ] **Step 2: Verify the dev server starts**

Run:

```bash
cd C:/Projects/claude-demo-playground
npm start
```

Expected: output includes `Local: http://localhost:4200/`, and opening that URL in a browser shows the default Angular welcome page. Kill with `Ctrl+C` once confirmed.

- [ ] **Step 3: Verify the baseline tests pass**

Run:

```bash
npm test -- --watch=false
```

Expected: 2 default tests pass (auto-generated `app.spec.ts` — Angular 21 file naming drops `.component`). Non-zero exit only on failure.

> **Angular 21 note:** the test runner is Vitest + jsdom (not Karma). Do NOT pass `--browsers=ChromeHeadless` — that's a Karma flag and Vitest rejects it.

- [ ] **Step 4: Commit the scaffold**

Run:

```bash
git -C C:/Projects/claude-demo-playground add -A
git -C C:/Projects/claude-demo-playground commit -m "chore: initial Angular 21 scaffold"
```

### Task 1.2: Add `.gitignore` entries and editor config

**Files:**

- Modify: `C:/Projects/claude-demo-playground/.gitignore`
- Create: `C:/Projects/claude-demo-playground/.editorconfig`

- [ ] **Step 1: Append project-specific ignores**

Append to `.gitignore` (after existing content):

```
# local brainstorm / memory artifacts
.superpowers/
memory/
```

- [ ] **Step 2: Create `.editorconfig`**

Write `C:/Projects/claude-demo-playground/.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 3: Commit**

```bash
git -C C:/Projects/claude-demo-playground add .gitignore .editorconfig
git -C C:/Projects/claude-demo-playground commit -m "chore: add .editorconfig and ignore local artifacts"
```

### Task 1.3: Extend Prettier config

**Files:**

- Modify: `C:/Projects/claude-demo-playground/.prettierrc` (created by scaffold)
- Create: `C:/Projects/claude-demo-playground/.prettierignore`
- Modify: `C:/Projects/claude-demo-playground/package.json` (add format scripts)

> **Angular 21 note:** Prettier 3.x is already installed as a devDependency and the scaffold writes a basic `.prettierrc`. This task extends rather than re-creates.

- [ ] **Step 1: Replace `.prettierrc` with the richer config**

The scaffold's `.prettierrc` only sets `printWidth`, `singleQuote`, and an HTML parser override. Replace with:

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "arrowParens": "always",
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "strict",
  "overrides": [
    {
      "files": "*.html",
      "options": { "parser": "angular" }
    }
  ]
}
```

- [ ] **Step 2: Create `.prettierignore`**

```
dist/
node_modules/
coverage/
.angular/
```

- [ ] **Step 3: Add Prettier npm scripts**

Modify `package.json` — inside `"scripts"`, add:

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 4: Run Prettier once across the repo**

```bash
npm run format
```

Expected: reformats scaffold files to match config. No errors.

- [ ] **Step 5: Commit**

```bash
git add .prettierrc .prettierignore package.json
git commit -m "chore: extend Prettier config and add format scripts"
```

### Task 1.4: Add ESLint (for `ng lint`)

**Files:**

- Create/modify: `eslint.config.js` (created by schematic)
- Modify: `package.json`

Angular 21 ships without a default linter. The CI workflow will call `ng lint`, which requires `@angular-eslint/schematics` to be installed and configured.

- [ ] **Step 1: Add `@angular-eslint` via schematic**

Run from repo root:

```bash
npx -y @angular/cli@21 add @angular-eslint/schematics --skip-confirmation
```

Expected: creates `eslint.config.js` and adds `lint` target into `angular.json`.

- [ ] **Step 2: Run lint to confirm it works**

```bash
npm run lint || npx ng lint
```

Expected: passes with no errors (scaffold is clean).

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore: add @angular-eslint for ng lint"
```

### Task 1.5: Create the `Mission` model

**Files:**

- Create: `src/app/mission.model.ts`

- [ ] **Step 1: Write the model file**

`src/app/mission.model.ts`:

```ts
/**
 * Statut d'avancement d'une mission.
 *
 * Les valeurs sont stockées en `lowercase` côté data pour permettre du
 * filtrage direct sur des enums générés par backend — les libellés d'affichage
 * sont gérés séparément dans le template.
 */
export type MissionStatus = 'active' | 'done';

/**
 * Représente une mission du carnet.
 */
export interface Mission {
  /** Identifiant stable (uuid-like ou numérique, décidé par la source). */
  readonly id: string;
  /** Titre lisible par l'utilisateur final. */
  readonly title: string;
  /** Statut courant de la mission. */
  readonly status: MissionStatus;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/mission.model.ts
git commit -m "feat: add Mission model"
```

### Task 1.6: `MissionService` — write the failing test first (TDD)

**Files:**

- Create: `src/app/mission.service.spec.ts`
- Create: `src/app/mission.service.ts` (stub in this task — bug implementation in the next)

- [ ] **Step 1: Write the failing test**

`src/app/mission.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { MissionService } from './mission.service';

describe('MissionService', () => {
  let service: MissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionService);
  });

  it('should start with a non-empty list of missions', () => {
    expect(service.missions().length).toBeGreaterThan(0);
  });

  it('toggleComplete should flip the status on the matching mission', () => {
    const first = service.missions()[0];
    const expectedStatus = first.status === 'done' ? 'active' : 'done';

    service.toggleComplete(first.id);
    const updated = service.missions().find((m) => m.id === first.id);

    expect(updated?.status).toBe(expectedStatus);
  });

  it('toggleComplete should return a new array reference (immutability)', () => {
    const before = service.missions();
    const first = before[0];

    service.toggleComplete(first.id);
    const after = service.missions();

    expect(after).not.toBe(before);
  });

  it('toggleComplete on an unknown id should not change the list', () => {
    const before = service.missions();
    service.toggleComplete('does-not-exist');
    expect(service.missions()).toBe(before);
  });
});
```

- [ ] **Step 2: Stub the service so the file compiles but tests fail**

`src/app/mission.service.ts`:

```ts
import { Injectable, signal } from '@angular/core';
import { Mission } from './mission.model';

/**
 * Source de vérité in-memory pour les missions affichées par le carnet.
 *
 * NOTE (démo) : l'implémentation courante de {@link toggleComplete} mute
 * l'élément en place — c'est le bug que la présentation vise à corriger en
 * direct. Ne pas "nettoyer" ce comportement en dehors du script de démo.
 */
@Injectable({ providedIn: 'root' })
export class MissionService {
  private readonly _missions = signal<Mission[]>([
    { id: 'm-1', title: "Refactor le pipeline d'authentification", status: 'active' },
    { id: 'm-2', title: 'Écrire le rapport trimestriel', status: 'active' },
    { id: 'm-3', title: 'Mettre à jour la documentation API', status: 'done' },
    { id: 'm-4', title: 'Préparer la démo client', status: 'active' },
  ]);

  /**
   * Liste réactive des missions — à lire par les composants via un `computed`
   * ou directement dans un template.
   */
  readonly missions = this._missions.asReadonly();

  /**
   * Bascule le statut de la mission identifiée par {@code id}.
   *
   * @param id identifiant stable de la mission cible
   */
  toggleComplete(id: string): void {
    // Implémentation arrive en Task 1.7 (avec le bug seed).
    void id;
  }
}
```

- [ ] **Step 3: Run tests and confirm they fail**

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Expected: 2 of 4 tests fail (the two that assert toggle behaviour). The other 2 (non-empty list, no-op on unknown id) may pass accidentally. That's fine — the failure is real.

- [ ] **Step 4: Commit the failing tests**

```bash
git add src/app/mission.service.spec.ts src/app/mission.service.ts
git commit -m "test: add MissionService specs (failing)"
```

### Task 1.7: `MissionService` — implement the seeded-bug version

**Files:**

- Modify: `src/app/mission.service.ts`

This implementation intentionally contains the seeded bug: it mutates the mission object in place instead of returning a new array. The test `toggleComplete should flip the status` **will still pass** because it reads the same mutated reference, but the immutability test **will fail** — and during the live demo, the UI won't update under `OnPush`.

- [ ] **Step 1: Replace `toggleComplete` with the buggy implementation**

In `src/app/mission.service.ts`, replace the `toggleComplete` method body:

```ts
  /**
   * Bascule le statut de la mission identifiée par {@code id}.
   *
   * @param id identifiant stable de la mission cible
   */
  toggleComplete(id: string): void {
    // DEMO SEED : mutation en place — Angular OnPush ne verra pas le changement.
    const list = this._missions();
    const target = list.find((m) => m.id === id);
    if (!target) {
      return;
    }
    (target as { status: MissionStatus }).status =
      target.status === 'done' ? 'active' : 'done';
    this._missions.set(list);
  }
```

Add the `MissionStatus` import at the top if missing:

```ts
import { Mission, MissionStatus } from './mission.model';
```

- [ ] **Step 2: Run tests and observe the specific failure**

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Expected:

- ✅ "should start with a non-empty list of missions"
- ✅ "toggleComplete should flip the status on the matching mission"
- ❌ "toggleComplete should return a new array reference (immutability)" — fails because `this._missions.set(list)` sets the same array reference
- ✅ "toggleComplete on an unknown id should not change the list"

**Do not fix the failing test — it is the seeded bug.** Its presence is required for the live demo.

- [ ] **Step 3: Commit**

```bash
git add src/app/mission.service.ts
git commit -m "feat(seed): MissionService.toggleComplete mutates in place (demo bug)"
```

### Task 1.8: `App` component — list UI with the TODO

**Files:**

- Modify: `src/app/app.ts` (the root component — Angular 21 names it `App`, file drops `.component`)
- Modify: `src/app/app.html`
- Modify: `src/app/app.scss`
- Modify: `src/app/app.spec.ts`

> **Angular 21 note:** the root component class is `App` (not `AppComponent`) and its files are `app.ts`, `app.html`, `app.scss`, `app.spec.ts`. Standalone is default — no `standalone: true` flag needed.

- [ ] **Step 1: Update `app.ts`**

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MissionService } from './mission.service';

/**
 * Composant racine — affiche la liste des missions et permet de basculer leur
 * statut. Utilise `OnPush` : toute mise à jour d'état doit produire une nouvelle
 * référence d'array (voir `CLAUDE.md`).
 */
@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly missionService = inject(MissionService);

  /** Flux réactif des missions, exposé au template. */
  readonly missions = this.missionService.missions;

  /**
   * Bascule le statut d'une mission.
   *
   * @param id identifiant stable de la mission à basculer
   */
  onToggle(id: string): void {
    this.missionService.toggleComplete(id);
  }
}
```

- [ ] **Step 2: Replace `app.html`**

```html
<main class="container">
  <h1>Carnet de missions</h1>

  <!-- TODO: ajouter un filtre par statut (toutes / actives / terminées) -->

  <ul class="missions">
    @for (mission of missions(); track mission.id) {
    <li class="mission" [class.mission--done]="mission.status === 'done'">
      <span class="mission__title">{{ mission.title }}</span>
      <button type="button" class="mission__toggle" (click)="onToggle(mission.id)">
        @if (mission.status === 'done') { Rouvrir } @else { Marquer terminée }
      </button>
    </li>
    }
  </ul>
</main>
```

- [ ] **Step 3: Replace `app.scss`**

```scss
:host {
  display: block;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  color: #1f2937;
  background: #f9fafb;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.container {
  max-width: 640px;
  margin: 0 auto;
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.missions {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mission {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  transition: opacity 0.15s ease;
}

.mission--done {
  opacity: 0.55;
}

.mission--done .mission__title {
  text-decoration: line-through;
}

.mission__title {
  font-size: 1rem;
}

.mission__toggle {
  cursor: pointer;
  border: 1px solid #3b82f6;
  background: white;
  color: #3b82f6;
  padding: 0.35rem 0.75rem;
  border-radius: 0.375rem;
  font: inherit;
  font-size: 0.875rem;

  &:hover {
    background: #eff6ff;
  }
}
```

- [ ] **Step 4: Update the auto-generated `app.spec.ts`**

Replace with:

```ts
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('should render the page heading', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Carnet de missions');
  });

  it('should render a row per mission', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('li.mission');
    expect(rows.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --watch=false
```

Expected: `App` tests pass. `MissionService` — the immutability test still fails (seeded bug). Total: 5 pass, 1 fail.

- [ ] **Step 6: Launch dev server and confirm visible bug**

```bash
npm start
```

Open `http://localhost:4200`. Click "Marquer terminée" on any active mission. **Expected demo bug:** visually nothing changes. Kill with `Ctrl+C`.

- [ ] **Step 7: Commit**

```bash
git add src/app
git commit -m "feat: render mission list and wire toggle button"
```

### Task 1.9: Seed `CLAUDE.md`

**Files:**

- Create: `CLAUDE.md`

- [ ] **Step 1: Write the file**

`CLAUDE.md`:

```markdown
# Carnet de missions — conventions

- Angular 21+, standalone components, signals pour l'état, zoneless
- OnPush partout — pas de mutation d'état, toujours retourner de nouveaux objets/arrays
- Tests avec Vitest + jsdom, un `describe` par service/component
- Pas de `any` en TypeScript — types explicites
- Textes en français, identifiants en anglais
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: seed CLAUDE.md with project conventions"
```

### Task 1.10: CI workflow

**Files:**

- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the workflow**

`.github/workflows/ci.yml`:

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test -- --watch=false

      - name: Format check
        run: npm run format:check
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run lint, tests, and format check on push and PR"
```

### Task 1.11: README with CI badge

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Replace `README.md` content (keep this file in French)**

````markdown
# Carnet de missions

![CI](https://github.com/<GITHUB_USERNAME>/claude-demo-playground/actions/workflows/ci.yml/badge.svg)

Petit traqueur de missions — utilisé comme repo de démo pendant la présentation Claude Code.

## Contexte

Ce repo contient **un bug volontaire** et **une fonctionnalité en TODO**, engineered pour la démo live :

- Le bouton "Marquer terminée" dans l'UI ne met rien à jour visuellement. Le test unitaire correspondant échoue.
- Un filtre par statut (toutes / actives / terminées) reste à implémenter — voir le `<!-- TODO -->` dans `src/app/app.component.html`.

Les conventions du projet sont dans [`CLAUDE.md`](./CLAUDE.md) — Claude Code les lit automatiquement en début de session.

## Démarrage

```bash
npm install
npm start          # http://localhost:4200
npm test -- --watch=false --browsers=ChromeHeadless
npm run lint
npm run format
```
````

## Stack

Angular 21, standalone components, signals, zoneless. Jasmine + Karma pour les tests. GitHub Actions pour le CI.

````

- [ ] **Step 2: Replace `<GITHUB_USERNAME>`**

Ask the user for their GitHub username, then replace the placeholder in the README. Commit only after the placeholder is resolved.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: README with scenario description and CI badge"
````

### Task 1.12: Create remote repo and push

**Files:** none

- [ ] **Step 1: Confirm branch**

```bash
git -C C:/Projects/claude-demo-playground branch --show-current
```

Expected: `main` (or `master`, depending on local git default — if `master`, the user's preference is usually `main`; rename with `git branch -m main` before pushing).

- [ ] **Step 2: Create the remote repo with `gh`**

```bash
cd C:/Projects/claude-demo-playground
gh repo create claude-demo-playground --public --source=. --remote=origin --push
```

Expected: creates `https://github.com/<user>/claude-demo-playground`, sets `origin`, and pushes `main`.

- [ ] **Step 3: Verify CI is running**

```bash
gh run list --limit 3
```

Expected: one in-progress or recently-completed workflow run. CI will fail (the seeded immutability test) — that's the intended state before the live demo.

Phase 1 done. Demo repo is online, CI is red on purpose, the bug and TODO are seeded.

---

## Phase 2 — `claude-cli` deck: scaffolding + theme

### Task 2.1: Scaffold Angular 21 project at the repo root

**Files:**

- Move: `C:/Projects/claude-cli/docs/` and `.superpowers/` temporarily
- Create: Angular 21 scaffold at `C:/Projects/claude-cli/`
- Restore: the moved folders

The repo root currently contains `docs/` (spec + plan) and `.superpowers/` (brainstorm artifacts). Angular CLI refuses to init into a non-empty directory, so we move those out, init, and move them back.

- [ ] **Step 1: Move existing folders to a sibling temp dir**

```bash
mkdir /c/Projects/claude-cli-temp
mv /c/Projects/claude-cli/docs /c/Projects/claude-cli-temp/
mv /c/Projects/claude-cli/.superpowers /c/Projects/claude-cli-temp/
ls /c/Projects/claude-cli/
```

Expected: `claude-cli/` is now empty.

- [ ] **Step 2: Scaffold Angular in-place**

```bash
cd /c/Projects/
npx -y @angular/cli@21 new claude-cli \
  --directory=claude-cli \
  --style=scss \
  --routing=true \
  --ssr=false \
  --strict=true \
  --skip-tests=false \
  --package-manager=npm \
  --skip-git=false \
  --defaults
```

Expected: Angular scaffolds into the existing (now-empty) `claude-cli/` directory. `--defaults` prevents interactive prompts. Angular CLI 21 auto-creates an initial git commit named `initial commit` — Step 6 replaces that commit message with the plan's subject via `git commit --amend`.

- [ ] **Step 3: Restore the moved folders**

```bash
mv /c/Projects/claude-cli-temp/docs /c/Projects/claude-cli/
mv /c/Projects/claude-cli-temp/.superpowers /c/Projects/claude-cli/
rmdir /c/Projects/claude-cli-temp
```

- [ ] **Step 4: Add ignores for non-committed folders**

Append to `/c/Projects/claude-cli/.gitignore`:

```
# local brainstorm / memory artifacts
.superpowers/
memory/
```

- [ ] **Step 5: Verify scaffold runs**

```bash
cd /c/Projects/claude-cli
npm test -- --watch=false
```

> Angular 21 uses Vitest + jsdom. Do NOT pass `--browsers=ChromeHeadless`.

Expected: 2 default tests pass (`app.spec.ts`, Angular 21 drops the `.component` suffix).

- [ ] **Step 6: Commit**

```bash
git -C /c/Projects/claude-cli add -A
# Amend Angular CLI's auto-created "initial commit" with the plan's subject,
# and stage the restored docs/ + updated .gitignore in the same commit.
git -C /c/Projects/claude-cli commit --amend -m "chore: initial Angular 21 scaffold for deck"
```

### Task 2.2: Install Tailwind CSS v4

**Files:**

- Create: `postcss.config.json`
- Modify: `src/styles.scss` (or rename; see below)
- Modify: `package.json`

Tailwind v4 uses `@tailwindcss/postcss`. Angular 21 compiles SCSS by default, but Tailwind v4's CSS-first config is plain CSS. We keep `styles.scss` as the entry point and `@import` Tailwind from there.

- [ ] **Step 1: Install the Tailwind packages**

```bash
cd C:/Projects/claude-cli
npm install --save-dev --save-exact tailwindcss@4 @tailwindcss/postcss@4 postcss@8
```

- [ ] **Step 2: Create `postcss.config.json` at the repo root**

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

- [ ] **Step 3: Replace `src/styles.scss` content**

```scss
@import 'tailwindcss';

/* Thème — variables Tailwind v4 (CSS-first config) */
@theme {
  --color-cream: #f5efe4;
  --color-ink: #2e1d10;
  --color-coral: #c84a2a;
  --color-sage: #7a8c5a;
  --color-muted: #8c6f54;

  --font-display: 'Crimson Pro', 'Crimson Text', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Menlo, monospace;
}

html,
body {
  height: 100%;
  margin: 0;
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 4: Launch dev server to confirm Tailwind compiles**

```bash
npm start
```

Open `http://localhost:4200`. Expected: cream background, default Angular banner rendered in the Inter font. Kill with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json postcss.config.json src/styles.scss
git commit -m "feat: install Tailwind v4 and define theme tokens"
```

### Task 2.3: Load Google Fonts

**Files:**

- Modify: `src/index.html`

- [ ] **Step 1: Add font links to `<head>`**

In `src/index.html`, inside `<head>` before the closing tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 2: Visual check**

`npm start`, confirm the body text shows in Inter (slightly rounded glyphs, not the system default). Kill.

- [ ] **Step 3: Commit**

```bash
git add src/index.html
git commit -m "feat: load Crimson Pro, Inter, and JetBrains Mono"
```

### Task 2.4: Install remaining deck dependencies + Prettier scripts + ESLint

**Files:**

- Modify: `package.json`
- Create: `.prettierignore`
- Modify: `.prettierrc` (extend scaffold default with the same richer ruleset as the demo repo)
- Create: `.gitattributes` (LF line endings)

Three independent sub-tasks bundled into a single logical commit (or a short sequence of small commits at the implementer's discretion).

- [ ] **Step 1: Install `ngx-highlightjs` (with Angular 21-compatible release) and `angular-cli-ghpages`**

```bash
cd /c/Projects/claude-cli
npm install ngx-highlightjs@latest
npm install --save-dev angular-cli-ghpages@latest
```

**Fallback if `ngx-highlightjs` has no Angular 21-compatible release at install time:** use Prism instead:

```bash
npm uninstall ngx-highlightjs
npm install prismjs
npm install --save-dev @types/prismjs
```

And adapt the `CodeSlide` implementation in Task 4.4 accordingly — code shape is equivalent.

- [ ] **Step 2: Install ESLint schematic (same as demo repo)**

```bash
npx -y @angular/cli@21 add @angular-eslint/schematics --skip-confirmation
npm run lint
```

Expected: schematic installs `@eslint/js`, `angular-eslint`, `eslint`, `typescript-eslint`, writes `eslint.config.js`, adds a `lint` target to `angular.json`, and adds `"lint": "ng lint"` to `package.json` scripts. `npm run lint` then prints `All files pass linting.`

- [ ] **Step 3: Extend Prettier config + scripts (mirror the demo repo)**

Replace `/c/Projects/claude-cli/.prettierrc` content with:

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "arrowParens": "always",
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "strict",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.html",
      "options": { "parser": "angular" }
    }
  ]
}
```

Create `/c/Projects/claude-cli/.prettierignore`:

```
dist/
node_modules/
coverage/
.angular/
```

Create `/c/Projects/claude-cli/.gitattributes`:

```
# Force LF line endings on checkout across platforms.
# Avoids CRLF/LF churn that would otherwise break `prettier --check` on CI
# when developers work from both Windows and macOS/Linux.
* text=auto eol=lf

# Keep binary assets untouched.
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
```

Add `format` and `format:check` npm scripts to `package.json` (preserve all existing scripts — at minimum `ng`, `start`, `build`, `watch`, `test`, `lint`):

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

Run `npm run format` once to normalize anything scaffold-written. Verify `npm run format:check`, `npm run lint`, and `npm test -- --watch=false` all pass.

- [ ] **Step 4: Commit**

```bash
cd /c/Projects/claude-cli
git add -A
git commit -m "chore: add highlight.js, gh-pages deploy, ESLint, and Prettier scripts"
```

The `-A` captures eslint.config.js, angular.json updates, package.json updates, .prettierrc, .prettierignore, .gitattributes, and any files Prettier reformatted in one go.

---

## Phase 3 — `claude-cli` deck: plumbing

### Task 3.1: `SlideConfig` types

**Files:**

- Create: `src/app/deck/slide-config.ts`

- [ ] **Step 1: Write the type file**

```ts
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
  | DemoCueSlideConfig
  | FaqSlideConfig;

/** Marker applied to FAQ slides so they can be filtered out of the main flow. */
export type SlideGroup = 'main' | 'faq';

export interface BaseSlide {
  /** Kind discriminator — picks the layout component. */
  readonly kind: SlideConfig['kind'];
  /** Small uppercased label shown above the title (e.g. "Bien prompter · 1/4"). */
  readonly label?: string;
  /** Which group the slide belongs to — `faq` slides are jumpable via shortcut. */
  readonly group?: SlideGroup;
}

export interface TitleSlideConfig extends BaseSlide {
  readonly kind: 'title';
  /** Display title, rendered in the display serif. */
  readonly title: string;
  /** Optional subtitle below the title. */
  readonly subtitle?: string;
}

export interface ContentSlideConfig extends BaseSlide {
  readonly kind: 'content';
  readonly title: string;
  /** 2–4 bullets shown below the title. */
  readonly bullets: readonly string[];
}

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
}

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

export interface DemoCueSlideConfig extends BaseSlide {
  readonly kind: 'demo-cue';
  /** Large cue text, e.g. "→ Démo live". */
  readonly cue: string;
  /** Optional speaker-facing note shown below, smaller. */
  readonly speakerNote?: string;
}

export interface FaqSlideConfig extends BaseSlide {
  readonly kind: 'faq';
  /** Question as the headline. */
  readonly question: string;
  /** Short paragraph answer — keep under ~40 words. */
  readonly answer: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/deck/slide-config.ts
git commit -m "feat: SlideConfig discriminated union"
```

### Task 3.2: `DeckService` — tests first

**Files:**

- Create: `src/app/deck/deck.service.spec.ts`
- Create: `src/app/deck/deck.service.ts` (stub)

- [ ] **Step 1: Write the spec**

`src/app/deck/deck.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { DeckService, DECK_SLIDES } from './deck.service';
import { SlideConfig } from './slide-config';

const FAKE_SLIDES: SlideConfig[] = [
  { kind: 'title', title: 'A' },
  { kind: 'title', title: 'B' },
  { kind: 'title', title: 'C' },
  { kind: 'faq', question: 'Q1?', answer: 'A1', group: 'faq' },
  { kind: 'faq', question: 'Q2?', answer: 'A2', group: 'faq' },
];

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DECK_SLIDES, useValue: FAKE_SLIDES }],
    });
    service = TestBed.inject(DeckService);
  });

  it('starts at index 0', () => {
    expect(service.currentIndex()).toBe(0);
  });

  it('next() increments, bounded at last index', () => {
    service.next();
    expect(service.currentIndex()).toBe(1);
    service.goTo(FAKE_SLIDES.length - 1);
    service.next();
    expect(service.currentIndex()).toBe(FAKE_SLIDES.length - 1);
  });

  it('prev() decrements, bounded at 0', () => {
    service.goTo(2);
    service.prev();
    expect(service.currentIndex()).toBe(1);
    service.goTo(0);
    service.prev();
    expect(service.currentIndex()).toBe(0);
  });

  it('goTo clamps out-of-range indices', () => {
    service.goTo(-5);
    expect(service.currentIndex()).toBe(0);
    service.goTo(999);
    expect(service.currentIndex()).toBe(FAKE_SLIDES.length - 1);
  });

  it('first() and last() jump to bounds of the main group', () => {
    service.last();
    expect(service.currentIndex()).toBe(2); // last main slide, not last FAQ
    service.first();
    expect(service.currentIndex()).toBe(0);
  });

  it('jumpToFaq(0) jumps to the first FAQ slide', () => {
    service.jumpToFaq(0);
    expect(service.current()?.kind).toBe('faq');
  });

  it('jumpToFaq out-of-range clamps to the last FAQ', () => {
    service.jumpToFaq(99);
    const current = service.current();
    expect(current?.kind).toBe('faq');
    expect((current as { question: string }).question).toBe('Q2?');
  });
});
```

- [ ] **Step 2: Write the service stub so the file compiles**

`src/app/deck/deck.service.ts`:

```ts
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
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Expected: all 7 `DeckService` tests pass. If any fail, fix the service to match the spec (the spec is authoritative).

- [ ] **Step 4: Commit**

```bash
git add src/app/deck
git commit -m "feat: DeckService with signal-based navigation state"
```

### Task 3.3: Wire `DECK_SLIDES` provider with a small placeholder

**Files:**

- Create: `src/app/deck/slides.data.ts` (placeholder — real content in Task 5.1)
- Modify: `src/app/app.config.ts`

- [ ] **Step 1: Create a minimal `slides.data.ts`**

`src/app/deck/slides.data.ts`:

```ts
import { SlideConfig } from './slide-config';

/**
 * Deck content. Full list is populated in a later task — this placeholder
 * exists so routing and service wiring can be exercised end-to-end before the
 * content is authored.
 */
export const SLIDES: readonly SlideConfig[] = [
  { kind: 'title', title: 'Claude Code', subtitle: 'Ce CLI que tout le monde devrait essayer' },
  {
    kind: 'content',
    title: 'Placeholder — contenu à venir',
    bullets: ['Task 5.1 remplit ce fichier avec les slides réelles.'],
  },
];
```

- [ ] **Step 2: Register the provider in `app.config.ts`**

`src/app/app.config.ts` (add to the `providers` array):

```ts
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { routes } from './app.routes';
import { DECK_SLIDES } from './deck/deck.service';
import { SLIDES } from './deck/slides.data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: DECK_SLIDES, useValue: SLIDES },
  ],
};
```

- [ ] **Step 3: Commit**

```bash
git add src/app/deck/slides.data.ts src/app/app.config.ts
git commit -m "feat: wire SLIDES into DeckService via DECK_SLIDES token"
```

### Task 3.4: Routing + `SlideHostComponent`

**Files:**

- Create: `src/app/deck/slide-host.component.ts`
- Modify: `src/app/app.routes.ts`

- [ ] **Step 1: Create `SlideHostComponent`**

`src/app/deck/slide-host.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeckService } from './deck.service';

/**
 * Route-bound host. Reads the `:index` route parameter, keeps `DeckService` in
 * sync, and renders the correct layout component for the current slide.
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
```

- [ ] **Step 2: Update `app.routes.ts`**

`src/app/app.routes.ts`:

```ts
import { Routes } from '@angular/router';
import { SlideHostComponent } from './deck/slide-host.component';

export const routes: Routes = [
  { path: '', redirectTo: '/slide/0', pathMatch: 'full' },
  { path: 'slide/:index', component: SlideHostComponent },
  { path: '**', redirectTo: '/slide/0' },
];
```

- [ ] **Step 3: Point `app.component.html` at the router outlet**

Replace `src/app/app.component.html` with:

```html
<router-outlet />
```

Ensure `src/app/app.component.ts` imports `RouterOutlet`:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
```

Update `src/app/app.component.spec.ts` accordingly — remove any content checks that depended on the scaffolded template; keep a minimal compilation test:

```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { DECK_SLIDES } from './deck/deck.service';
import { SLIDES } from './deck/slides.data';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), { provide: DECK_SLIDES, useValue: SLIDES }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

- [ ] **Step 4: Run tests and dev server**

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```

Open `http://localhost:4200`. Expected: redirects to `/slide/0`. Shows "TODO: TitleSlide — Task 4.1" on a cream background. Navigate manually to `/slide/1` and see "TODO: ContentSlide". Kill.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: route-driven SlideHostComponent syncing with DeckService"
```

### Task 3.5: Keyboard navigation on `AppComponent`

**Files:**

- Modify: `src/app/app.component.ts`

- [ ] **Step 1: Add a `@HostListener` for key navigation**

Replace `src/app/app.component.ts`:

```ts
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
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly deck = inject(DeckService);

  /** Whether the shortcut-reference overlay is currently visible. */
  readonly showShortcuts = signal(false);
  /** FAQ mode: when pressed, next digit key (1-9) jumps to that FAQ slide. */
  private readonly waitingForFaqDigit = signal(false);

  /**
   * Handles global navigation keys. Ignored when focus is inside an editable
   * element so that future `<input>`-bearing slides keep working.
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

    // FAQ digit follow-up
    if (this.waitingForFaqDigit()) {
      const digit = Number.parseInt(event.key, 10);
      if (Number.isFinite(digit) && digit >= 1 && digit <= 9) {
        this.deck.jumpToFaq(digit - 1);
        this.waitingForFaqDigit.set(false);
        event.preventDefault();
        return;
      }
      // any other key cancels FAQ mode
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
```

- [ ] **Step 2: Manual verification**

```bash
npm start
```

Press `→`, `←`, `Home`, `End`, `Q` then `1`, `F`. Confirm URL changes, placeholder slide text changes. Kill.

- [ ] **Step 3: Commit**

```bash
git add src/app/app.component.ts
git commit -m "feat: keyboard navigation and shortcut overlay trigger"
```

### Task 3.6: `ProgressBar`, `KeyHint`, and shortcuts overlay components

**Files:**

- Create: `src/app/shared/progress-bar.component.ts`
- Create: `src/app/shared/key-hint.component.ts`
- Create: `src/app/shared/shortcuts-overlay.component.ts`
- Modify: `src/app/app.component.ts` + `app.component.html`

- [ ] **Step 1: `progress-bar.component.ts`**

```ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DeckService } from '../deck/deck.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="bar" [style.width.%]="percent()"></div>`,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(46, 29, 16, 0.08);
        z-index: 50;
      }
      .bar {
        height: 100%;
        background: var(--color-coral);
        transition: width 250ms ease;
      }
    `,
  ],
})
export class ProgressBarComponent {
  private readonly deck = inject(DeckService);

  readonly percent = computed(() => {
    const total = this.deck.total();
    if (total <= 1) return 100;
    return ((this.deck.currentIndex() + 1) / total) * 100;
  });
}
```

- [ ] **Step 2: `key-hint.component.ts`**

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-key-hint',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span>← →</span>
    <span class="dot">•</span>
    <span>F pour plein écran</span>
    <span class="dot">•</span>
    <span>? pour l'aide</span>
  `,
  styles: [
    `
      :host {
        position: fixed;
        bottom: 1rem;
        right: 1.25rem;
        z-index: 40;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        color: var(--color-muted);
        letter-spacing: 0.05em;
        display: flex;
        gap: 0.45rem;
        align-items: center;
      }
      .dot {
        opacity: 0.5;
      }
    `,
  ],
})
export class KeyHintComponent {}
```

- [ ] **Step 3: `shortcuts-overlay.component.ts`**

```ts
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-shortcuts-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="backdrop" (click)="dismissed.emit()"></div>
      <div class="panel" role="dialog" aria-labelledby="sc-title">
        <h2 id="sc-title">Raccourcis</h2>
        <dl>
          <dt>← / →</dt><dd>Slide précédente / suivante</dd> <dt>Espace / PageDown</dt
          ><dd>Slide suivante</dd> <dt>Home / End</dt><dd>Première / dernière slide</dd> <dt>F</dt
          ><dd>Plein écran</dd> <dt>Q puis 1–4</dt><dd>Sauter vers une FAQ</dd> <dt>?</dt
          ><dd>Afficher / cacher cette aide</dd> <dt>Échap</dt
          ><dd>Sortir du plein écran / fermer</dd>
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
  readonly visible = input.required<boolean>();
  readonly dismissed = output<void>();
}
```

- [ ] **Step 4: Mount the three components on `AppComponent`**

Update `src/app/app.component.ts` imports:

```ts
import { RouterOutlet } from '@angular/router';
import { ProgressBarComponent } from './shared/progress-bar.component';
import { KeyHintComponent } from './shared/key-hint.component';
import { ShortcutsOverlayComponent } from './shared/shortcuts-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProgressBarComponent, KeyHintComponent, ShortcutsOverlayComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

Update `src/app/app.component.html`:

```html
<app-progress-bar />
<router-outlet />
<app-key-hint />
<app-shortcuts-overlay [visible]="showShortcuts()" (dismissed)="showShortcuts.set(false)" />
```

- [ ] **Step 5: Manual verification**

`npm start`. Confirm: coral progress bar at top, key hint at bottom right. Press `?` — overlay appears with shortcuts list. Press `?` again or `Esc` — dismissed. Kill.

- [ ] **Step 6: Commit**

```bash
git add src/app
git commit -m "feat: progress bar, key hint, and shortcuts overlay"
```

---

## Phase 4 — deck layout components

All six layouts follow the same pattern: standalone component, `OnPush`, one `input<>()` for the slide config, themed using Tailwind classes + the CSS theme tokens.

### Task 4.1: `TitleSlide`

**Files:**

- Create: `src/app/deck/layouts/title-slide.component.ts`
- Modify: `src/app/deck/slide-host.component.ts`

- [ ] **Step 1: Write the component**

`src/app/deck/layouts/title-slide.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TitleSlideConfig } from '../slide-config';

@Component({
  selector: 'app-title-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col justify-center items-start h-screen px-24 max-w-5xl mx-auto">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h1 class="title">{{ slide().title }}</h1>
      @if (slide().subtitle) {
        <p class="subtitle">{{ slide().subtitle }}</p>
      }
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 1.25rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-weight: 500;
        font-size: clamp(3rem, 7vw, 5.5rem);
        line-height: 1.05;
        letter-spacing: -0.02em;
        color: var(--color-ink);
        margin: 0;
      }
      .subtitle {
        font-family: var(--font-sans);
        font-size: clamp(1.125rem, 1.75vw, 1.5rem);
        color: var(--color-muted);
        margin-top: 1.5rem;
        max-width: 48ch;
        line-height: 1.4;
      }
    `,
  ],
})
export class TitleSlideComponent {
  readonly slide = input.required<TitleSlideConfig>();
}
```

- [ ] **Step 2: Wire into `SlideHostComponent`**

In `slide-host.component.ts`, add to imports and template:

```ts
import { TitleSlideComponent } from './layouts/title-slide.component';

// @Component(
//   imports: [TitleSlideComponent],
// ...
// )
```

Replace the `@case ('title')` template branch:

```html
@case ('title') { <app-title-slide [slide]="$any(slide())" /> }
```

- [ ] **Step 3: Manual check**

`npm start`. `/slide/0` should show the placeholder title slide in Crimson Pro on a cream background.

- [ ] **Step 4: Commit**

```bash
git add src/app/deck
git commit -m "feat: TitleSlide layout"
```

### Task 4.2: `ContentSlide`

**Files:**

- Create: `src/app/deck/layouts/content-slide.component.ts`
- Modify: `src/app/deck/slide-host.component.ts`

- [ ] **Step 1: Write the component**

`src/app/deck/layouts/content-slide.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentSlideConfig } from '../slide-config';

@Component({
  selector: 'app-content-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col justify-center h-screen px-24 max-w-4xl mx-auto">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h2 class="title">{{ slide().title }}</h2>
      <ul class="bullets">
        @for (b of slide().bullets; track b) {
          <li>{{ b }}</li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 500;
        letter-spacing: -0.015em;
        line-height: 1.1;
        margin: 0 0 2rem 0;
      }
      .bullets {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        font-family: var(--font-sans);
        font-size: clamp(1rem, 1.5vw, 1.25rem);
        line-height: 1.5;
      }
      .bullets li {
        padding-left: 1.5rem;
        position: relative;
      }
      .bullets li::before {
        content: '—';
        position: absolute;
        left: 0;
        color: var(--color-coral);
      }
    `,
  ],
})
export class ContentSlideComponent {
  readonly slide = input.required<ContentSlideConfig>();
}
```

- [ ] **Step 2: Wire into `SlideHostComponent`**

Add to imports and replace the `@case ('content')` branch:

```html
@case ('content') { <app-content-slide [slide]="$any(slide())" /> }
```

- [ ] **Step 3: Commit**

```bash
git add src/app/deck
git commit -m "feat: ContentSlide layout"
```

### Task 4.3: `PrincipleSlide` (the ❌/✅ slide)

**Files:**

- Create: `src/app/deck/layouts/principle-slide.component.ts`
- Modify: `src/app/deck/slide-host.component.ts`

- [ ] **Step 1: Write the component**

`src/app/deck/layouts/principle-slide.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PrincipleSlideConfig } from '../slide-config';

@Component({
  selector: 'app-principle-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col justify-center h-screen px-24 max-w-5xl mx-auto">
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
      @if (slide().takeaway) {
        <p class="takeaway">{{ slide().takeaway }}</p>
      }
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-size: clamp(2rem, 4vw, 3rem);
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
        font-size: clamp(0.95rem, 1.35vw, 1.1rem);
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
      .takeaway {
        margin-top: 2rem;
        font-family: var(--font-sans);
        font-style: italic;
        color: var(--color-muted);
        max-width: 58ch;
      }
    `,
  ],
})
export class PrincipleSlideComponent {
  readonly slide = input.required<PrincipleSlideConfig>();
}
```

- [ ] **Step 2: Wire into `SlideHostComponent`**

Add import; replace `@case ('principle')`:

```html
@case ('principle') { <app-principle-slide [slide]="$any(slide())" /> }
```

- [ ] **Step 3: Commit**

```bash
git add src/app/deck
git commit -m "feat: PrincipleSlide layout"
```

### Task 4.4: `CodeSlide` with syntax highlighting

**Files:**

- Create: `src/app/deck/layouts/code-slide.component.ts`
- Modify: `src/app/app.config.ts` (add highlight provider)
- Modify: `src/app/deck/slide-host.component.ts`

- [ ] **Step 1: Provide the highlight module**

Modify `src/app/app.config.ts` to add the Highlight provider:

```ts
import { provideHighlightOptions } from 'ngx-highlightjs';

// inside providers:
provideHighlightOptions({
  fullLibraryLoader: () => import('highlight.js'),
  themePath: 'https://cdn.jsdelivr.net/npm/highlight.js/styles/atom-one-dark.min.css',
}),
```

(If you fell back to Prism in Task 2.4, skip this step and configure Prism in the component directly via `Prism.highlightElement` on init.)

- [ ] **Step 2: Write `code-slide.component.ts`**

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { CodeSlideConfig } from '../slide-config';

@Component({
  selector: 'app-code-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
  template: `
    <section class="flex flex-col justify-center h-screen px-24 max-w-5xl mx-auto">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h2 class="title">{{ slide().title }}</h2>
      <pre class="code"><code [highlight]="slide().code" [language]="slide().language"></code></pre>
      @if (slide().caption) {
        <p class="caption">{{ slide().caption }}</p>
      }
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-size: clamp(1.75rem, 3vw, 2.5rem);
        font-weight: 500;
        letter-spacing: -0.015em;
        margin: 0 0 1.5rem 0;
      }
      .code {
        background: #1a1a1a;
        color: #e6edf3;
        padding: 1.25rem 1.5rem;
        border-radius: 10px;
        font-family: var(--font-mono);
        font-size: clamp(0.8rem, 1vw, 0.95rem);
        line-height: 1.55;
        overflow-x: auto;
        max-width: 72ch;
      }
      .caption {
        margin-top: 1rem;
        font-family: var(--font-sans);
        color: var(--color-muted);
        font-size: 0.95rem;
        max-width: 72ch;
      }
    `,
  ],
})
export class CodeSlideComponent {
  readonly slide = input.required<CodeSlideConfig>();
}
```

- [ ] **Step 3: Wire into `SlideHostComponent`**

```html
@case ('code') { <app-code-slide [slide]="$any(slide())" /> }
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: CodeSlide layout with ngx-highlightjs"
```

### Task 4.5: `DemoCueSlide`

**Files:**

- Create: `src/app/deck/layouts/demo-cue-slide.component.ts`
- Modify: `src/app/deck/slide-host.component.ts`

- [ ] **Step 1: Write the component**

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DemoCueSlideConfig } from '../slide-config';

@Component({
  selector: 'app-demo-cue-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col items-center justify-center h-screen text-center">
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
  readonly slide = input.required<DemoCueSlideConfig>();
}
```

- [ ] **Step 2: Wire into `SlideHostComponent`**

```html
@case ('demo-cue') { <app-demo-cue-slide [slide]="$any(slide())" /> }
```

- [ ] **Step 3: Commit**

```bash
git add src/app/deck
git commit -m "feat: DemoCueSlide layout"
```

### Task 4.6: `FaqSlide`

**Files:**

- Create: `src/app/deck/layouts/faq-slide.component.ts`
- Modify: `src/app/deck/slide-host.component.ts`

- [ ] **Step 1: Write the component**

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaqSlideConfig } from '../slide-config';

@Component({
  selector: 'app-faq-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col justify-center h-screen px-24 max-w-4xl mx-auto">
      <div class="label">FAQ</div>
      <h2 class="question">{{ slide().question }}</h2>
      <p class="answer">{{ slide().answer }}</p>
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-coral);
        margin-bottom: 1rem;
        font-weight: 600;
      }
      .question {
        font-family: var(--font-display);
        font-weight: 500;
        font-size: clamp(1.75rem, 3.5vw, 2.75rem);
        line-height: 1.15;
        letter-spacing: -0.015em;
        margin: 0 0 1.75rem 0;
      }
      .answer {
        font-family: var(--font-sans);
        font-size: clamp(1rem, 1.4vw, 1.2rem);
        line-height: 1.55;
        max-width: 58ch;
        color: var(--color-ink);
      }
    `,
  ],
})
export class FaqSlideComponent {
  readonly slide = input.required<FaqSlideConfig>();
}
```

- [ ] **Step 2: Wire into `SlideHostComponent`**

```html
@case ('faq') { <app-faq-slide [slide]="$any(slide())" /> }
```

- [ ] **Step 3: Run the full suite**

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm start
```

Navigate through all placeholder slides with `←`/`→` and verify each of the 6 layouts renders without console errors. Kill.

- [ ] **Step 4: Commit**

```bash
git add src/app/deck
git commit -m "feat: FaqSlide layout"
```

---

## Phase 5 — deck content

### Task 5.1: Populate `slides.data.ts` with the real content

**Files:**

- Modify: `src/app/deck/slides.data.ts`

This task replaces the placeholder `SLIDES` export with the full French content (~30 slides). Because content maps 1:1 onto the spec's narrative spine, slide ordering below intentionally mirrors §3 of the spec.

- [ ] **Step 1: Replace the file contents**

```ts
import { SlideConfig } from './slide-config';

/**
 * Full deck content for the Claude Code presentation, in French.
 *
 * Organized by Act (1–5) then FAQ appendix. Slides in the `faq` group are
 * reachable via the `Q` + digit shortcut rather than sequential navigation.
 */
export const SLIDES: readonly SlideConfig[] = [
  // ───────────────────────── Act 1 — Le hook
  {
    kind: 'title',
    label: 'Act 1 · Le hook',
    title: 'Claude Code',
    subtitle: 'Ce collègue qui vit dans votre repo.',
  },
  {
    kind: 'principle',
    label: 'Pourquoi un CLI',
    title: 'Pas un chatbot de plus.',
    bad: 'ChatGPT vit dans un onglet — il ne connaît rien à votre code.',
    good: 'Claude Code vit dans votre repo — il lit vos fichiers, lance vos commandes, apprend vos conventions.',
    takeaway: 'Un collègue, pas un presse-papier.',
  },
  {
    kind: 'content',
    label: 'Révélation méta',
    title: 'Ces slides ont été construites avec Claude Code.',
    bullets: [
      'Je vous montre le commit log à la fin.',
      "Toute l'app Angular, tout le thème, tout le déploiement.",
      "Ce que vous voyez, c'est la preuve que ça marche.",
    ],
  },

  // ───────────────────────── Act 2 — La boucle de base
  {
    kind: 'title',
    label: 'Act 2',
    title: 'La boucle de base',
    subtitle: "Ce qu'il faut pour commencer — et rien de plus.",
  },
  {
    kind: 'code',
    label: 'Installation',
    title: 'Une ligne, une commande.',
    language: 'bash',
    code: `npm install -g @anthropic-ai/claude-code
claude   # dans n'importe quel repo`,
    caption:
      "Première fois : un écran d'auth s'ouvre dans le navigateur. Ensuite, c'est juste `claude`.",
  },
  {
    kind: 'content',
    label: 'Les essentiels',
    title: "5 choses à retenir — aucune autre pour l'instant.",
    bullets: [
      'Shift+Tab → plan mode (le plus gros unlock)',
      '@fichier.ts → pointer Claude sur un fichier précis',
      '# → sauvegarder une note dans CLAUDE.md',
      '!commande → exécuter un shell inline',
      '/clear → repartir sur un contexte propre',
    ],
  },
  {
    kind: 'principle',
    label: 'Essentiel · 1/5',
    title: 'Shift+Tab — plan mode.',
    bad: 'Claude applique directement, vous découvrez le résultat après.',
    good: 'Claude propose un plan, vous approuvez, il exécute.',
    takeaway: "30 secondes d'attente, 30 minutes de mauvaise direction évitées.",
  },
  {
    kind: 'principle',
    label: 'Essentiel · 2/5',
    title: '@fichier.ts — le contexte.',
    bad: "Explique moi comment fonctionne l'authentification.",
    good: 'Explique-moi @auth.service.ts et @auth.guard.ts, leur rôle respectif.',
    takeaway: 'Claude lit exactement les fichiers que vous nommez — pas de devinette.',
  },
  {
    kind: 'principle',
    label: 'Essentiel · 3/5',
    title: '# — la mémoire projet.',
    bad: 'Re-rappeler les conventions à chaque nouvelle conversation.',
    good: '# Toujours utiliser RxJS. Jamais de Promise. → écrit dans CLAUDE.md.',
    takeaway: 'CLAUDE.md est chargé automatiquement. Une fois pour toutes.',
  },
  {
    kind: 'principle',
    label: 'Essentiel · 4/5',
    title: '!commande — shell inline.',
    bad: 'Sortir du prompt, lancer `npm test`, revenir coller le résultat.',
    good: '!npm test — Claude voit la sortie directement dans la conversation.',
    takeaway: 'Pas besoin de jongler entre les fenêtres.',
  },
  {
    kind: 'principle',
    label: 'Essentiel · 5/5',
    title: '/clear — le reset.',
    bad: 'Continuer une conversation de 2h qui a dérivé sur trois sujets.',
    good: '/clear — contexte propre, nouvelle tâche bien cadrée.',
    takeaway: "Claude n'oublie pas ce qu'il y a dans votre code, seulement la discussion.",
  },
  {
    kind: 'content',
    label: 'Il y a plus, mais',
    title: "C'est un deuxième talk.",
    bullets: [
      'Hooks, subagents, MCP servers, slash commands custom, plugins…',
      "Tout ça existe et c'est puissant.",
      'Mais pour commencer : les 5 ci-dessus suffisent largement.',
    ],
  },

  // ───────────────────────── Act 3 — Bien prompter
  {
    kind: 'title',
    label: 'Act 3',
    title: 'Bien prompter.',
    subtitle: 'Vous ne discutez pas avec Claude — vous dirigez un agent.',
  },
  {
    kind: 'principle',
    label: 'Bien prompter · 1/4',
    title: 'Un objectif, pas une tâche.',
    bad: 'Fix the login bug.',
    good: "@LoginComponent connecte l'utilisateur mais n'enregistre pas son rôle dans AuthService. Trouve pourquoi et ajoute un test unitaire.",
    takeaway: "Un objectif a des critères d'acceptation. Une tâche a juste un verbe.",
  },
  {
    kind: 'principle',
    label: 'Bien prompter · 2/4',
    title: 'Contexte, pas solution.',
    bad: 'Ajoute un Map<String, List<User>> ici.',
    good: '@UserService doit grouper les users par département. Utilise le style de @OrderService.groupByCustomer.',
    takeaway: "Donnez-lui des pointeurs. Laissez-le choisir l'outil.",
  },
  {
    kind: 'principle',
    label: 'Bien prompter · 3/4',
    title: 'Plan mode pour tout ce qui est non-trivial.',
    bad: "Refactor la couche d'accès base de données. (Claude attaque directement.)",
    good: "Shift+Tab → Refactor la couche d'accès base de données. (Claude propose, vous approuvez.)",
    takeaway: '30 secondes d\'attente, beaucoup moins de "ah mais c\'était pas du tout ça".',
  },
  {
    kind: 'principle',
    label: 'Bien prompter · 4/4',
    title: 'Vérifier avant de faire confiance.',
    bad: 'Claude dit "c\'est fait, les tests passent". Vous merge.',
    good: 'Claude dit "c\'est fait, les tests passent". Vous lancez les tests vous-même.',
    takeaway: 'Excellent junior, pas oracle.',
  },

  // ───────────────────────── Act 4 — Démo live
  {
    kind: 'demo-cue',
    cue: '→ Démo live',
    speakerNote: 'Cloner claude-demo-playground — fixer le bug — ajouter le filtre par statut.',
  },

  // ───────────────────────── Act 5 — Meta reveal & takeaways
  {
    kind: 'title',
    label: 'Act 5',
    title: 'git log.',
    subtitle: 'La preuve que ces slides ont été construites avec Claude Code.',
  },
  {
    kind: 'content',
    label: 'Lundi matin',
    title: 'Trois choses à essayer cette semaine.',
    bullets: [
      'Déposer un CLAUDE.md dans votre repo actuel avec 3 conventions.',
      'Prochain ticket : plan mode en premier.',
      'Prochain prompt : commencer par @fichier.',
    ],
  },
  {
    kind: 'content',
    label: 'Cette présentation',
    title: 'Cette URL = votre cheat sheet.',
    bullets: [
      'Le deck reste en ligne — revenez-y quand vous oubliez un raccourci.',
      'Le repo de démo est public — clonez-le, cassez-le, essayez.',
      "Des questions plus tard ? Venez, j'aime en parler.",
    ],
  },

  // ───────────────────────── FAQ appendix (reached via Q + digit)
  {
    kind: 'faq',
    group: 'faq',
    question: "C'est safe avec notre code privé ?",
    answer:
      "Par défaut, votre code n'est pas utilisé pour entraîner les modèles Anthropic. Les plans Enterprise ajoutent des garanties sur la rétention et l'isolation. Pour un repo sensible, vérifier la config de votre workspace avant de lancer la commande.",
  },
  {
    kind: 'faq',
    group: 'faq',
    question: 'Ça marche avec IntelliJ / VS Code ?',
    answer:
      "Oui — il existe des extensions officielles Claude Code pour VS Code et JetBrains. L'agent reste le même (il tourne dans votre terminal), mais l'extension ajoute une intégration avec le diff viewer et les fichiers ouverts.",
  },
  {
    kind: 'faq',
    group: 'faq',
    question: 'On peut le brancher sur Jira / Confluence ?',
    answer:
      "Oui — via les MCP servers (Model Context Protocol). On branche une source externe (Jira, Confluence, une DB, une doc interne) et Claude peut la consulter pendant une conversation. C'est un sujet à part entière.",
  },
  {
    kind: 'faq',
    group: 'faq',
    question: 'Et GitHub Copilot, on garde ou on jette ?',
    answer:
      'Les deux sont complémentaires, pas concurrents. Copilot autocomplète pendant que vous tapez. Claude Code planifie et exécute du travail multi-fichiers. Beaucoup de devs utilisent les deux — Copilot pour la vitesse locale, Claude Code pour les tâches plus larges.',
  },
];
```

- [ ] **Step 2: Run the app end-to-end**

```bash
npm start
```

Walk through the deck with `←`/`→`. Press `Q` then `1`, `2`, `3`, `4` to jump between FAQs. Confirm: every slide renders, no console errors, the visual style matches the spec. Kill.

- [ ] **Step 3: Full test pass**

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run lint
npm run build
```

All three must succeed.

- [ ] **Step 4: Commit**

```bash
git add src/app/deck/slides.data.ts
git commit -m "feat: populate deck content (Acts 1-5 + FAQ)"
```

---

## Phase 6 — Deploy `claude-cli`

### Task 6.1: Set up `ng deploy` script

**Files:**

- Modify: `package.json`
- Modify: `angular.json`

- [ ] **Step 1: Confirm `angular-cli-ghpages` is installed**

```bash
npm ls angular-cli-ghpages
```

Expected: listed as devDependency (installed in Task 2.4). If missing, install it.

- [ ] **Step 2: Add a `deploy` npm script**

In `package.json` scripts:

```json
"deploy": "ng deploy --base-href=/claude-cli/ --no-silent"
```

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add deploy script targeting GitHub Pages"
```

### Task 6.2: Push the deck repo to GitHub

**Files:** none

- [ ] **Step 1: Confirm current branch**

```bash
git -C C:/Projects/claude-cli branch --show-current
```

Expected: `main`.

- [ ] **Step 2: Create the remote repo and push**

```bash
cd C:/Projects/claude-cli
gh repo create claude-cli --public --source=. --remote=origin --push
```

- [ ] **Step 3: Confirm it's pushed**

```bash
gh repo view claude-cli --web
```

Opens the repo in a browser. Confirm commit history is visible.

### Task 6.3: Deploy to GitHub Pages

**Files:** none (creates `gh-pages` branch)

- [ ] **Step 1: Run the deploy**

```bash
cd C:/Projects/claude-cli
npm run deploy
```

Expected: builds `dist/`, pushes to a `gh-pages` branch, prints the deployed URL.

- [ ] **Step 2: Enable GitHub Pages in repo settings**

If GitHub Pages isn't already set up:

```bash
gh api repos/<user>/claude-cli/pages -X POST -f source.branch=gh-pages -f source.path=/
```

Replace `<user>` with the actual GitHub username. If the API call returns "already enabled," that's fine.

- [ ] **Step 3: Verify**

Open `https://<user>.github.io/claude-cli/` in a browser. Expected: the deck loads, routes to `/slide/0`, keyboard navigation works. Refresh mid-deck — URL stays on current slide.

If the deck 404s on a mid-deck URL refresh, it's because GitHub Pages doesn't handle client-side routing by default. Fix by creating `404.html` that redirects to `index.html` (Angular can also handle this via a hash strategy if preferred — see Angular routing docs). Add this as a follow-up task if needed; don't block deployment on it.

---

## Phase 7 — Rehearsal

### Task 7.1: End-to-end rehearsal checklist

**Files:** none (mental checklist)

This task is not code — it's the final sanity check before the talk. Run through every item and confirm ✅ before calling the project done.

- [ ] **Item 1: Fresh clone of `claude-demo-playground` works**

```bash
cd /tmp    # or any scratch dir
git clone https://github.com/<user>/claude-demo-playground
cd claude-demo-playground
npm install
npm start
```

Expected: dev server at `http://localhost:4200`, UI renders, buttons click (and visibly fail to update — the seeded bug).

- [ ] **Item 2: Run `claude` on the fresh demo clone**

In the same scratch clone, with `claude` installed:

```bash
claude
# prompt: "The toggle button doesn't update the UI. Fix it."
```

Expected: Claude reads `CLAUDE.md`, notices the "no mutation" convention, proposes an immutability fix (`.map` returning a new array with a new object), tests pass, UI works.

**Critical:** if Claude's first attempt misses the immutability lesson (i.e., it's perfect on the first try), the talk's "honest moment" doesn't land. Consider weakening the `CLAUDE.md` wording so the scenario is more likely to require a follow-up prompt. Iterate until the scenario reliably produces a correction moment during rehearsal.

- [ ] **Item 3: Plan-mode adds the filter feature cleanly**

Same scratch clone, `claude`, `Shift+Tab`:

```
Add a filter dropdown (toutes / actives / terminées) above the mission list. Keep the `OnPush` + immutability conventions.
```

Expected: plan mode shows a 3-file change (component, template, maybe service). Approve, run, see feature working.

- [ ] **Item 4: Deployed deck is reachable from a fresh browser**

Open a private/incognito window. Navigate to `https://<user>.github.io/claude-cli/`. Expected: loads, cream background, first slide renders in Crimson Pro. Keyboard nav works.

- [ ] **Item 5: Full talk run-through**

Run the full deck end-to-end with a timer. Expected: ~30 min content, leaving ~10 min of natural Q&A slack inside a 40-min slot.

- [ ] **Item 6: Fallback plan**

Record an asciinema of the demo from Item 2 & 3 _before_ the talk. Store it accessible from the `demo-cue` slide (open in a browser tab, paused). Decision on the day: go live or play the recording. Both are fine — ship the option.

---

## Self-review summary

The plan covers every requirement in the spec:

| Spec section                        | Covered in                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| §3 Narrative spine (Acts 1-5 + FAQ) | Task 5.1 (content); Tasks 4.1-4.6 (layouts for each slide kind)                                        |
| §4 Visual style                     | Task 2.2 (theme tokens) + Task 2.3 (fonts) + all layout `:host` styles                                 |
| §5 Deck architecture                | Phases 2-4 (scaffolding, plumbing, layouts)                                                            |
| §6 Demo repo                        | Phase 1 in full                                                                                        |
| §7 Hosting                          | Tasks 1.12, 6.2 (GitHub repos), 6.3 (Pages deploy)                                                     |
| §8 Non-goals                        | Explicitly not built: no presenter mode, no fake-terminal emulator, no long-scroll layout              |
| §9 Risks                            | Task 7.1 Item 2 addresses the "CLAUDE.md doesn't fire" risk; Item 6 addresses the live-demo-fails risk |
| §10 Deliverables checklist          | Matches Tasks 1.12, 6.3, and 7.1                                                                       |

No placeholders remain in committed code. The only placeholder in the plan is `<GITHUB_USERNAME>` / `<user>`, which is resolved at execution time in Tasks 1.11 and 6.3.
