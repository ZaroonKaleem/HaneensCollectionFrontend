import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../../Services/cart.service';
import { FeaturedProductDto, FeaturedProductsService } from '../../../../Services/featured-products.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: FeaturedProductDto | undefined;
  quantity: number = 1;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: FeaturedProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(productId);
    } else {
      this.error = 'Product ID not found';
      this.isLoading = false;
    }
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.productsService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart({
      id: this.product.productId,
      name: this.product.name,
      price: this.product.salePrice ?? this.product.originalPrice,
      quantity: this.quantity,
      imageUrl: this.product.images[0]?.imageUrl || 'assets/placeholder.jpg'
    });

    const addButton = document.querySelector('.add-to-cart-btn');
    if (addButton) {
      addButton.classList.add('animate-pulse');
      setTimeout(() => {
        addButton.classList.remove('animate-pulse');
      }, 500);
    }
  }

  // Calculate discount percentage
  calculateDiscount(product: FeaturedProductDto): number {
    if (!product.salePrice || !product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
  }

  // Generate star rating array
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