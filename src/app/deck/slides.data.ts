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
      'Ce que vous voyez, c’est la preuve que ça marche.',
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
    title: 'Sous Windows — deux options.',
    language: 'powershell',
    code: `# Option 1 — PowerShell, une ligne
irm https://claude.ai/install.ps1 | iex

# Option 2 — installeur officiel
# Téléchargez le .exe depuis claude.ai/download`,
    caption:
      "Pas de Node.js à gérer : l'installeur natif pose le binaire `claude` directement dans votre PATH.",
  },
  {
    kind: 'terminal',
    label: 'Premier lancement',
    title: 'Ensuite, dans votre repo.',
    titleBar: 'Windows PowerShell',
    cwd: 'C:\\dev\\mon-projet',
    command: 'claude',
    caption:
      "Première fois : un écran d'auth s'ouvre dans le navigateur. Ensuite, c'est juste `claude` dans n'importe quel dossier.",
  },
  {
    kind: 'content',
    label: 'Les essentiels',
    title: "Les plus essentiels — aucun autre pour l'instant.",
    bullets: [
      '/init → poser un premier CLAUDE.md',
      '/plan (ou Shift+Tab) → plan mode — le plus gros unlock',
      '/clear → repartir sur un contexte propre',
      '/compact → condenser la conversation sans tout perdre',
      '/usage → voir votre quota et le modèle actif',
      '@fichier.ts → pointer Claude sur un fichier précis',
      '# → sauvegarder une note dans CLAUDE.md',
    ],
  },
  {
    kind: 'principle',
    label: 'Essentiel',
    title: '/init — premier CLAUDE.md.',
    bad: "Partir d'une page blanche pour rédiger CLAUDE.md.",
    good: '/init → Claude lit votre repo et propose un CLAUDE.md de départ (langage, scripts, conventions).',
    demo: {
      command: '/init',
      output: [
        'Analyzing repository…',
        '  ✓ Angular 21 (TypeScript, Vitest)',
        '  ✓ Conventions : OnPush, signals',
        '',
        'CLAUDE.md écrit à la racine du repo.',
      ],
    },
    takeaway: 'Un bon starter — à affiner avec # au fil du temps.',
  },
  {
    kind: 'principle',
    label: 'Essentiel',
    title: 'Plan mode — /plan ou Shift+Tab.',
    bad: 'Claude applique directement, vous découvrez le résultat après.',
    good: 'Claude propose un plan, vous approuvez, il exécute.',
    demo: {
      command: '/plan',
      output: [
        'Plan mode enabled.',
        '',
        '  1. Lire auth.service.ts',
        '  2. Remplacer BehaviorSubject par signal',
        '  3. Adapter les tests',
        '',
        '[Approve / Edit / Cancel]',
      ],
    },
    takeaway:
      "Tapez /plan dans le prompt (ou Shift+Tab si vous préférez le raccourci) — 30 secondes d'attente, 30 minutes de mauvaise direction évitées.",
  },
  {
    kind: 'principle',
    label: 'Essentiel',
    title: '/clear — le reset.',
    bad: 'Continuer une conversation de 2h qui a dérivé sur trois sujets.',
    good: '/clear — contexte propre, nouvelle tâche bien cadrée.',
    demo: {
      command: '/clear',
      output: [
        'Conversation effacée.',
        'Vos fichiers et CLAUDE.md restent chargés.',
      ],
    },
    takeaway: "Claude n'oublie pas ce qu'il y a dans votre code, seulement la discussion.",
  },
  {
    kind: 'principle',
    label: 'Essentiel',
    title: '/compact — le condenseur.',
    bad: "Session de 2h, 100k tokens — Claude ralentit, vous n'osez pas tout jeter.",
    good: '/compact → Claude résume la conversation, vous gardez le fil, les tokens repartent bas.',
    demo: {
      command: '/compact',
      output: [
        'Compacting 47 messages (124k tokens)…',
        '',
        'Kept :',
        '  • Task : refactor auth.service',
        '  • Decisions : utiliser signals',
        '',
        'Context now : 8k tokens.',
      ],
    },
    takeaway: "/clear oublie tout. /compact garde l'essentiel.",
  },
  {
    kind: 'principle',
    label: 'Essentiel',
    title: '/usage — votre quota.',
    bad: "Au milieu d'une session, Claude répond « quota atteint ». Surprise.",
    good: "/usage → quota restant, modèle actif, fenêtre de 5h en un coup d'œil.",
    demo: {
      command: '/usage',
      output: [
        'Plan    : Max 5×',
        'Model   : claude-opus-4-7',
        '',
        'Session window (5h) :',
        '  Opus      34 %',
        '  Sonnet     8 %',
        '',
        'Next reset : in 3h 37m',
      ],
    },
    takeaway: "Sur Pro ou Max, savoir où vous en êtes avant d'attaquer la grosse session.",
  },
  {
    kind: 'principle',
    label: 'Essentiel',
    title: '@fichier.ts — le contexte.',
    bad: "Explique moi comment fonctionne l'authentification.",
    good: 'Explique-moi @auth.service.ts et @auth.guard.ts, leur rôle respectif.',
    takeaway:
      'Claude lit exactement les fichiers que vous nommez — pas de devinette. Un chemin complet pasté fonctionne aussi (voir FAQ).',
  },
  {
    kind: 'principle',
    label: 'Essentiel',
    title: '# — la mémoire projet.',
    bad: 'Re-rappeler les conventions à chaque nouvelle conversation.',
    good: '# Toujours utiliser RxJS. Jamais de Promise. → écrit dans CLAUDE.md.',
    takeaway:
      'CLAUDE.md est chargé automatiquement. Une fois pour toutes. Dire « retiens ça » marche aussi (voir FAQ).',
  },
  {
    kind: 'content',
    label: 'Il y a plus, mais',
    title: "C'est un deuxième talk.",
    bullets: [
      'Hooks, subagents, MCP servers, slash commands custom, plugins…',
      "Tout ça existe et c'est puissant.",
      'Mais pour commencer : les essentiels ci-dessus suffisent largement.',
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
    good: "/plan → Refactor la couche d'accès base de données. (Claude propose, vous approuvez.)",
    takeaway: "30 secondes d'attente, beaucoup moins de « ah mais c'était pas du tout ça ».",
  },
  {
    kind: 'principle',
    label: 'Bien prompter · 4/4',
    title: 'Vérifier avant de faire confiance.',
    bad: "Claude dit « c'est fait, les tests passent ». Vous merge.",
    good: "Claude dit « c'est fait, les tests passent ». Vous lancez les tests vous-même.",
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
      'Oui — via les MCP servers (Model Context Protocol). On branche une source externe (Jira, Confluence, une DB, une doc interne) et Claude peut la consulter pendant une conversation. C’est un sujet à part entière.',
  },
  {
    kind: 'faq',
    group: 'faq',
    question: 'Et GitHub Copilot, on garde ou on jette ?',
    answer:
      'Les deux sont complémentaires, pas concurrents. Copilot autocomplète pendant que vous tapez. Claude Code planifie et exécute du travail multi-fichiers. Beaucoup de devs utilisent les deux — Copilot pour la vitesse locale, Claude Code pour les tâches plus larges.',
  },
  {
    kind: 'faq',
    group: 'faq',
    question: 'Je peux coller un chemin complet au lieu de @fichier ?',
    answer:
      "Oui — Claude lit le fichier dans les deux cas. Le préfixe @ ajoute juste l'autocomplete du CLI (scopé au repo, anti-typo, facile à empiler : @a.ts @b.ts @c.ts). Un chemin pasté fonctionne aussi. Seule nuance : hors du repo, Claude demandera la permission avant de lire.",
  },
  {
    kind: 'faq',
    group: 'faq',
    question: 'Je peux juste dire « retiens ça » au lieu de # ?',
    answer:
      "Oui, mais pas pareil. # est une commande du CLI : zéro token, note écrite verbatim, et Claude vous demande où l'enregistrer (projet, user, parent). « Retiens ça » consomme un tour d'agent, Claude reformule souvent, et il choisit le fichier à votre place.",
  },
];
