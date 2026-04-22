import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';

import { routes } from './app.routes';
import { DECK_SLIDES } from './deck/deck.service';
import { SLIDES } from './deck/slides.data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
      themePath: 'https://cdn.jsdelivr.net/npm/highlight.js/styles/atom-one-dark.min.css',
    }),
    { provide: DECK_SLIDES, useValue: SLIDES },
  ],
};
