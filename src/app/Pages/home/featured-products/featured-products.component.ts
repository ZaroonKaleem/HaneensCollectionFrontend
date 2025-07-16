import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeaturedProductDto, FeaturedProductsService } from '../../../Services/featured-products.service';
import { CartService } from '../../../Services/cart.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent implements OnInit {
  products: FeaturedProductDto[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private featuredProductsService: FeaturedProductsService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  addToCart(product: FeaturedProductDto): void {
    this.cartService.addToCart({
      id: product.productId,
      name: product.name,
      price: product.salePrice ?? product.originalPrice,
      quantity: 1,
      imageUrl: product.images[0]?.imageUrl || 'assets/placeholder.jpg'
    });

    // Show success notification
    // this.toastService.showSuccess(`${product.name} added to cart!`);
    
    // Optional: You can add animation/feedback here
    this.animateAddToCart(product.productId);
  }
    private animateAddToCart(productId: string): void {
    // This is just an example - you can implement any animation you like
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
      button.classList.add('animate-bounce');
      setTimeout(() => {
        button.classList.remove('animate-bounce');
      }, 1000);
    }
  }

  loadFeaturedProducts() {
    this.isLoading = true;
    this.featuredProductsService.getFeaturedProducts().subscribe({
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
  const safeRating = rating || 0; // Fallback to 0 if undefined
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