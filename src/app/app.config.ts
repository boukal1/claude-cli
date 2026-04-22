import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DECK_SLIDES } from './deck/deck.service';
import { SLIDES } from './deck/slides.data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: DECK_SLIDES, useValue: SLIDES },
  ],
};
