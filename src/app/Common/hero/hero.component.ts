// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Observable, Subscription, interval } from 'rxjs';
// import { map, take } from 'rxjs/operators';
// import { loadHeroSection } from '../../Store/HeroSection/hero-section.actions';
// import { selectHeroViewModel } from '../../Store/HeroSection/hero-section.selectors';
// import { AppState } from '../../Store/app.state';

// interface HeroSlide {
//   image: string;
//   title: string;
//   subtitle: string;
//   buttonText: string;
// }

// interface HeroViewModel {
//   heroSection: {
//     bannerImageBase64?: string;
//     imageContentType?: string;
//     title?: string;
//     subtitle?: string;
//   } | null;
//   loading: boolean;
//   error: string | null;
// }

// @Component({
//   selector: 'app-hero',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './hero.component.html',
//   styleUrls: ['./hero.component.css']
// })
// export class HeroComponent implements OnInit, OnDestroy {
//   currentSlide = 0;
//   private autoSlideSubscription?: Subscription;
  
//   private defaultSlides: HeroSlide[] = [
//     {
//       image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
//       title: 'SUMMER SALE',
//       subtitle: 'Up to 50% off on selected items',
//       buttonText: 'SHOP NOW'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
//       title: 'Designed for the Bold',
//       subtitle: 'Wear Confidence, Own the Spotlight',
//       buttonText: 'SHOP NOW'
//     }
//   ];

//   vm$: Observable<{
//     slides: HeroSlide[];
//     loading: boolean;
//     error: string | null;
//   }>;

//   constructor(private store: Store<AppState>) {
//    // In your hero.component.ts
// this.vm$ = this.store.select(selectHeroViewModel).pipe(
//   map(viewModel => ({
//     ...viewModel,
//     slides: this.getSlides(viewModel.heroSection),
//     currentSlide: this.currentSlide
//   }))
// );
//   }

//   ngOnInit() {
//     this.store.dispatch(loadHeroSection());
//     this.startAutoSlide();
//   }

//   ngOnDestroy() {
//     this.stopAutoSlide();
//   }

// private getImageUrl(base64?: string, contentType?: string): string | null {
//   if (!base64 || !contentType) {
//     return null;
//   }
//   return `data:${contentType};base64,${base64}`;
// }

// private getSlides(heroSection: {
//   bannerImageBase64?: string;
//   imageContentType?: string;
//   title?: string;
//   subtitle?: string;
// } | null): any[] {
//   const slides = [...this.defaultSlides];
  
//   if (heroSection) {
//     const imageUrl = this.getImageUrl(heroSection.bannerImageBase64, heroSection.imageContentType);
    
//     if (imageUrl) {
//       slides.unshift({
//         image: imageUrl,
//         title: heroSection.title || 'Default Title',
//         subtitle: heroSection.subtitle || 'Default Subtitle',
//         buttonText: 'SHOP NOW'
//       });
//     }
//   }
  
//   return slides;
// }

//   private startAutoSlide() {
//     this.autoSlideSubscription = interval(5000).subscribe(() => {
//       this.nextSlide();
//     });
//   }

//   private stopAutoSlide() {
//     this.autoSlideSubscription?.unsubscribe();
//   }

//   nextSlide() {
//     this.vm$.pipe(take(1)).subscribe(({ slides }) => {
//       if (slides.length > 0) {
//         this.currentSlide = (this.currentSlide + 1) % slides.length;
//       }
//     });
//   }

//   prevSlide() {
//     this.vm$.pipe(take(1)).subscribe(({ slides }) => {
//       if (slides.length > 0) {
//         this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
//       }
//     });
//   }

//   goToSlide(index: number) {
//     this.vm$.pipe(take(1)).subscribe(({ slides }) => {
//       if (index >= 0 && index < slides.length) {
//         this.currentSlide = index;
//       }
//     });
//   }
// }


// src/app/hero/hero.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HeroService, HeroSectionResponse } from '../../Services/hero.service';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

interface HeroViewModel {
  slide: HeroSlide | null;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  vm$: Observable<HeroViewModel> = of({ slide: null, loading: true, error: null });

  constructor(private heroService: HeroService) {
    this.vm$ = this.heroService.getHeroSection().pipe(
      map(heroSection => ({
        slide: this.getSlide(heroSection),
        loading: false,
        error: heroSection ? null : 'Failed to load hero section'
      })),
      catchError(() => of({
        slide: this.getDefaultSlide(),
        loading: false,
        error: 'Failed to load hero section'
      }))
    );
  }

  ngOnInit() {
    // The API call is triggered when vm$ is subscribed to in the template
  }

  private getImageUrl(base64?: string, contentType?: string): string | null {
    if (!base64 || !contentType) {
      return null;
    }

    // Check if the base64 string already includes the data URL prefix
    if (base64.startsWith('data:')) {
      // Validate that it’s a proper data URL
      if (base64.startsWith(`data:${contentType};base64,`)) {
        return base64; // Use as-is if it’s already a valid data URL
      } else {
        console.warn('Invalid data URL prefix in base64 string:', base64);
        return null; // Return null if the prefix is incorrect
      }
    }

    // If no data URL prefix, construct the data URL
    return `data:${contentType};base64,${base64}`;
  }

  private getSlide(heroSection: HeroSectionResponse | null): HeroSlide | null {
    if (heroSection) {
      const imageUrl = this.getImageUrl(heroSection.bannerImageBase64, heroSection.imageContentType);
      
      if (imageUrl) {
        return {
          image: imageUrl,
          title: heroSection.title || 'Default Title',
          subtitle: heroSection.subtitle || 'Default Subtitle',
          buttonText: 'SHOP NOW'
        };
      }
    }
    
    return this.getDefaultSlide();
  }

  private getDefaultSlide(): HeroSlide {
    return {
      image: 'assets/images/default-hero.jpg', // Provide a valid fallback image path
      title: 'Default Title',
      subtitle: 'Default Subtitle',
      buttonText: 'SHOP NOW'
    };
  }
}