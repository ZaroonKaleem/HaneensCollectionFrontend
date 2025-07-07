import { createAction, props } from '@ngrx/store';

export interface HeroSectionData {
  bannerImageBase64?: string;
  imageContentType?: string;
  title?: string;
  subtitle?: string;
}

// Save Hero Section Actions
export const saveHeroSection = createAction(
  '[Hero Section] Save Hero Section',
  props<{ formData: FormData }>()
);

export const saveHeroSectionSuccess = createAction(
  '[Hero Section] Save Hero Section Success',
  props<{ heroSection: HeroSectionData }>()
);

export const saveHeroSectionFailure = createAction(
  '[Hero Section] Save Hero Section Failure',
  props<{ error: string }>()
);

// Load Hero Section Actions
export const loadHeroSection = createAction(
  '[Hero Section] Load Hero Section'
);

export const loadHeroSectionSuccess = createAction(
  '[Hero Section] Load Hero Section Success',
  props<{ heroSection: HeroSectionData }>()
);

export const loadHeroSectionFailure = createAction(
  '[Hero Section] Load Hero Section Failure',
  props<{ error: string }>()
);