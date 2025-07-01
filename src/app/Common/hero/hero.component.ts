import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-hero',
    imports: [
        CommonModule
    ],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.css'
})
export class HeroComponent {
 slides = [
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'SUMMER SALE',
      subtitle: 'Up to 50% off on selected items',
      buttonText: 'SHOP NOW'
    },
    {
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Designed for the Bold',
      subtitle: 'Wear Confidence, Own the Spotlight',
      buttonText: 'SHOP NOW'
    },
    {
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Crafted for the Fearless',
      subtitle: 'Embrace Your Power, Steal the Show',
      buttonText: 'SHOP NOW'
    }
  ];

  currentSlide = 0;

  ngOnInit() {
    // Optional: Auto-slide every 5 seconds
    setInterval(() => this.nextSlide(), 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
