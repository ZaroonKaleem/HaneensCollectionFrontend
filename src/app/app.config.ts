import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { AuthEffects } from './Store/Auth/auth.effects';
import { authReducer } from './Store/Auth/auth.reducer';
import { provideHttpClient } from '@angular/common/http';
import { heroSectionReducer } from './Store/HeroSection/hero-section.reducer';
import { HeroSectionEffects } from './Store/HeroSection/hero-section.effects';

export const appConfig: ApplicationConfig = {
  // providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
  providers: [
    provideRouter(routes),
    provideStore({ 
      auth: authReducer,
      HeroSection: heroSectionReducer
    }),
    provideEffects([
      AuthEffects,
      HeroSectionEffects
    ]),

    provideHttpClient()
    // ... other providers
  ]
};
