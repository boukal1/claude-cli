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
