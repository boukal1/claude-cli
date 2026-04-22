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
];
