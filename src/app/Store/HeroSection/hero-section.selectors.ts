import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { HeroSectionState } from './hero-section.reducer';

// Select the heroSection slice from the root state, with fallback to avoid undefined
const selectHeroSectionState = (state: AppState) => state.heroSection || { heroSection: null, loading: false, error: null };

// Individual selectors
export const selectHeroSection = createSelector(
  selectHeroSectionState,
  (state: HeroSectionState) => state.heroSection
);

export const selectHeroLoading = createSelector(
  selectHeroSectionState,
  (state: HeroSectionState) => state.loading ?? false
);

export const selectHeroError = createSelector(
  selectHeroSectionState,
  (state: HeroSectionState) => state.error ?? null
);

// ViewModel selector with proper typing
export const selectHeroViewModel = createSelector(
  selectHeroSection,
  selectHeroLoading,
  selectHeroError,
  (heroSection, loading, error) => {
    let imageUrl: string | null = null;
    if (heroSection?.bannerImageBase64 && heroSection?.imageContentType) {
      // Strip any existing data URL prefix from bannerImageBase64
      const base64 = heroSection.bannerImageBase64.startsWith('data:') 
        ? heroSection.bannerImageBase64.split(',')[1] 
        : heroSection.bannerImageBase64;
      imageUrl = `data:${heroSection.imageContentType};base64,${base64}`;
    }
    
    // Log for debugging
    console.log('Hero ViewModel:', { heroSection, imageUrl, loading, error });

    return {
      heroSection,
      loading,
      error,
      slide: heroSection && imageUrl
        ? {
            image: imageUrl,
            title: heroSection.title || 'Default Title',
            subtitle: heroSection.subtitle || 'Default Subtitle',
            buttonText: 'SHOP NOW'
          }
        : {
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
            title: 'Default Title',
            subtitle: 'Default Subtitle',
            buttonText: 'SHOP NOW'
          }
    };
  }
);