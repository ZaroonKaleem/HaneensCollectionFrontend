import { createReducer, on } from '@ngrx/store';
import { 
  saveHeroSectionSuccess,
  loadHeroSection,
  loadHeroSectionSuccess,
  loadHeroSectionFailure
} from './hero-section.actions';

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface HeroSectionState {
  heroSection: {
    bannerImageBase64?: string;
    imageContentType?: string;
    title?: string;
    subtitle?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export const initialState: HeroSectionState = {
  heroSection: null,
  loading: false,
  error: null
};

export const heroSectionReducer = createReducer(
  initialState,
  // Save Hero Section
  on(saveHeroSectionSuccess, (state, { heroSection }) => ({
    ...state,
    heroSection,
    error: null
  })),
  
  // Load Hero Section
  on(loadHeroSection, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadHeroSectionSuccess, (state, { heroSection }) => ({
    ...state,
    heroSection,
    loading: false,
    error: null
  })),
  on(loadHeroSectionFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);