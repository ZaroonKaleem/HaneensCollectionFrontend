// src/app/store/app.state.ts
import { AuthState } from './Auth/auth.reducer';
import { HeroSectionState } from './HeroSection/hero-section.reducer';

export interface AppState {
  auth: AuthState;
  heroSection: HeroSectionState;
}
