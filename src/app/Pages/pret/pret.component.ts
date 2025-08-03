import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFiltersComponent } from '../products/product-filters/product-filters.component';
import { PretService } from '../../Services/pret.service';
import { Router } from '@angular/router';


// DTO Interface included directly in the component file
interface ProductImageDto {
  imageId: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  mimeType?: string;
}

interface PretDto {
  productId: string;
  name: string;
  category: string;
  shortDescription?: string;
  originalPrice: number;
  salePrice?: number;
  salePercentage: number;
  sizesAvailable?: string[];
  stockQuantity: number;
  averageRating?: number;
  ratingCount?: number;
  colorOptions?: string[];
  material?: string;
  isNew: boolean;
  isExclusive: boolean;
  shippingInfo?: string;
  images?: ProductImageDto[];
  note?: string;
}

@Component({
  selector: 'app-pret',
  standalone: true,
  imports: [
    ProductFiltersComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './pret.component.html',
  styleUrl: './pret.component.css'
})
export class PretComponent implements OnInit {
  products: PretDto[] = [];
  filteredProducts: PretDto[] = [];
  isLoading = true;
  error: string | null = null;
  totalProducts = 0;
  sortOption = 'best-selling';

  constructor(
    private pretService: PretService,
  private router: Router) { }

  ngOnInit() {
    this.loadProducts();
  }

    viewProductDetails(productId: string) {
  this.router.navigate(['/pret', productId]);
}

  loadProducts() {
    this.isLoading = true;
    this.error = null;
    
    this.pretService.getAllPret().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.totalProducts = products.length;
        this.sortProducts(this.sortOption);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  applyFilters() {
    
  }
  // applyFilters(filters: any) {
  //   this.filteredProducts = this.products.filter(product => {
  //     // Price filter
  //     const priceMatch = Object.keys(filters.prices).length === 0 || Object.keys(filters.prices).some(range => {
  //       if (!filters.prices[range]) return false;
  //       const price = product.salePrice || product.originalPrice;
  //       if (range === '3000-6000') return price >= 3000 && price <= 6000;
  //       if (range === '6000-9000') return price > 6000 && price <= 9000;
  //       if (range === '9000-12000') return price > 9000 && price <= 12000;
  //       if (range === 'Above 12000') return price > 12000;
  //       return false;
  //     });

  //     // Color filter
  //     const colorMatch = Object.keys(filters.colors).length === 0 || 
  //       (product.colorOptions && product.colorOptions.some(color => filters.colors[color]));

  //     // Material filter
  //     const materialMatch = !filters.material || 
  //       (product.material && product.material.toLowerCase().includes(filters.material.toLowerCase()));

  //     // New/Exclusive filters
  //     const newMatch = !filters.isNew || product.isNew;
  //     const exclusiveMatch = !filters.isExclusive || product.isExclusive;

  //     return priceMatch && colorMatch && materialMatch && newMatch && exclusiveMatch;
  //   });

  //   this.totalProducts = this.filteredProducts.length;
  //   this.sortProducts(this.sortOption);
  // }

  sortProducts(option: string) {
    this.sortOption = option;
    
    switch(option) {
      case 'a-z':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice));
        break;
      case 'price-low':
        this.filteredProducts.sort((a, b) => (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice));
        break;
      case 'date-new':
        // Assuming you have a dateAdded property in your PretDto
        // this.filteredProducts.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'date-old':
        // this.filteredProducts.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      default: // 'best-selling'
        // Default sorting (you might want to sort by popularity or leave as-is)
        break;
    }
  }

  getPrimaryImage(product: PretDto): string | null {
    if (!product.images || product.images.length === 0) return null;
    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage ? primaryImage.imageUrl : product.images[0].imageUrl;
  }

  getDisplayPrice(product: PretDto): { price: number, originalPrice?: number } {
    return {
      price: product.salePrice || product.originalPrice,
      originalPrice: product.salePrice ? product.originalPrice : undefined
    };
  }
}