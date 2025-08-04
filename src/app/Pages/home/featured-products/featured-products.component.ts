import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../Services/cart.service';
import { AllSuitsService } from '../../../Services/all-suits.service';
import { StitchedSuitService } from '../../../Services/stitched-suit.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
  
  
export class FeaturedProductsComponent implements OnInit {
  currentOffset = 0;
itemWidth = 0; // Will be calculated based on your item width
visibleItems = 4; // Number of items visible at once

ngAfterViewInit() {
  this.calculateItemWidth();
}

calculateItemWidth() {
  // Calculate the width of each carousel item including margin/padding
  // You might need to adjust this based on your actual layout
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    const item = carouselContainer.querySelector('.carousel-item');
    if (item) {
      const style = window.getComputedStyle(item);
      this.itemWidth = item.clientWidth + 
                       parseInt(style.marginLeft) + 
                       parseInt(style.marginRight);
    }
  }
}

nextSlide() {
  const maxOffset = -((this.products.length - this.visibleItems) * this.itemWidth);
  this.currentOffset = Math.max(this.currentOffset - (this.itemWidth * this.visibleItems), maxOffset);
}

prevSlide() {
  this.currentOffset = Math.min(this.currentOffset + (this.itemWidth * this.visibleItems), 0);
}

  products: any[] = []; // Use your ProductDto type if available
  isLoading = true;
  error: string | null = null;

  constructor(
    private stitchedSuitService: StitchedSuitService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  addToCart(product: any): void {
    this.cartService.addToCart({
      id: product.productId,
      name: product.name,
      price: product.salePrice ?? product.originalPrice,
      quantity: 1,
      imageUrl: product.images?.[0]?.imageUrl || 'assets/placeholder.jpg'
    });
    this.animateAddToCart(product.productId);
  }

  private animateAddToCart(productId: string): void {
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
      button.classList.add('animate-bounce');
      setTimeout(() => button.classList.remove('animate-bounce'), 1000);
    }
  }

  loadFeaturedProducts() {
    this.isLoading = true;
    this.stitchedSuitService.getAllStitchedSuits().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getStarRating(rating: number | undefined): string[] {
    const stars: string[] = [];
    const safeRating = rating || 0;
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('fas fa-star');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('fas fa-star-half-alt');
      } else {
        stars.push('far fa-star');
      }
    }
    return stars;
  }
}
