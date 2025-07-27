import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFiltersComponent } from '../products/product-filters/product-filters.component';
import { LuxuryService } from '../../Services/luxury.service';

// DTO Interfaces included directly in the component file
interface ProductImageDto {
  imageId: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  mimeType?: string;
}

interface LuxuryDto {
  productId: string;
  name: string;
  category: string;
  shortDescription?: string;
  originalPrice: number;
  salePrice?: number;
  salePercentage?: number;
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
  // Luxury-specific properties
  isLimitedEdition: boolean;
  designer?: string;
  collectionYear?: number;
  authenticityCode?: string;
}

@Component({
  selector: 'app-luxury',
  standalone: true,
  imports: [
    ProductFiltersComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './luxury.component.html',
  styleUrl: './luxury.component.css'
})
export class LuxuryComponent implements OnInit {
  products: LuxuryDto[] = [];
  filteredProducts: LuxuryDto[] = [];
  isLoading = true;
  error: string | null = null;
  totalProducts = 0;
  sortOption = 'best-selling';

  constructor(private luxuryService: LuxuryService) {}

  ngOnInit() {
    this.loadProducts();
  }

 loadProducts() {
    this.isLoading = true;
    this.error = null;
    
    this.luxuryService.getAllLuxury().subscribe({
      next: (products: LuxuryDto[]) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.totalProducts = products.length;
        this.sortProducts(this.sortOption);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load luxury items. Please try again later.';
        this.isLoading = false;
        console.error('Error loading luxury items:', err);
      }
    });

    // Uncomment to use mock data for testing
    // setTimeout(() => {
    //   this.products = this.getMockLuxuryProducts();
    //   this.filteredProducts = [...this.products];
    //   this.totalProducts = this.products.length;
    //   this.isLoading = false;
    // }, 1000);
  }

  private getMockLuxuryProducts(): LuxuryDto[] {
    return [
      {
        productId: 'lux1',
        name: 'Designer Silk Gown',
        category: 'Luxury',
        shortDescription: 'Handcrafted silk evening gown',
        originalPrice: 24999,
        sizesAvailable: ['XS', 'S', 'M'],
        stockQuantity: 5,
        averageRating: 4.9,
        ratingCount: 36,
        colorOptions: ['Gold', 'Black'],
        material: 'Pure Silk',
        isNew: true,
        isExclusive: true,
        isLimitedEdition: true,
        designer: 'Elie Saab',
        collectionYear: 2023,
        authenticityCode: 'ES2023-001',
        images: [
          {
            imageId: 'lux-img1',
            imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
            altText: 'Designer Silk Gown',
            isPrimary: true
          }
        ],
        note: 'Dry clean only. Includes certificate of authenticity.'
      },
      {
        productId: 'lux2',
        name: 'Cashmere Overcoat',
        category: 'Luxury',
        shortDescription: 'Italian cashmere winter coat',
        originalPrice: 18999,
        salePrice: 15999,
        salePercentage: 16,
        sizesAvailable: ['S', 'M', 'L', 'XL'],
        stockQuantity: 7,
        averageRating: 4.7,
        ratingCount: 28,
        colorOptions: ['Camel', 'Charcoal'],
        material: '100% Cashmere',
        isNew: false,
        isExclusive: false,
        isLimitedEdition: false,
        designer: 'Loro Piana',
        collectionYear: 2022,
        shippingInfo: 'Express shipping available',
        images: [
          {
            imageId: 'lux-img2',
            imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
            altText: 'Cashmere Overcoat',
            isPrimary: true
          }
        ]
      }
    ];
  }

  applyFilters(filters: any) {
    if (!filters || Object.keys(filters).length === 0) {
      this.filteredProducts = [...this.products];
      this.totalProducts = this.products.length;
      return;
    }

    this.filteredProducts = this.products.filter(product => {
      // Price filter
      const priceMatch = !filters.prices || Object.keys(filters.prices).length === 0 || 
        Object.keys(filters.prices).some(range => {
          if (!filters.prices[range]) return false;
          const price = product.salePrice || product.originalPrice;
          if (range === '10000-20000') return price >= 10000 && price <= 20000;
          if (range === '20000-30000') return price > 20000 && price <= 30000;
          if (range === '30000-50000') return price > 30000 && price <= 50000;
          if (range === 'Above 50000') return price > 50000;
          return false;
        });

      // Color filter
      const colorMatch = !filters.colors || Object.keys(filters.colors).length === 0 || 
        (product.colorOptions && product.colorOptions.some(color => filters.colors[color]));

      // Material filter
      const materialMatch = !filters.material || 
        (product.material && product.material.toLowerCase().includes(filters.material.toLowerCase()));

      // Status filters
      const newMatch = filters.isNew === undefined || filters.isNew === product.isNew;
      const exclusiveMatch = filters.isExclusive === undefined || filters.isExclusive === product.isExclusive;
      const limitedMatch = filters.isLimitedEdition === undefined || filters.isLimitedEdition === product.isLimitedEdition;

      // Designer filter
      const designerMatch = !filters.designer || 
        (product.designer && product.designer.toLowerCase().includes(filters.designer.toLowerCase()));

      return priceMatch && colorMatch && materialMatch && newMatch && exclusiveMatch && limitedMatch && designerMatch;
    });

    this.totalProducts = this.filteredProducts.length;
    this.sortProducts(this.sortOption);
  }

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
        this.filteredProducts.sort((a, b) => 
          (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice));
        break;
      case 'price-low':
        this.filteredProducts.sort((a, b) => 
          (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice));
        break;
      case 'date-new':
        // Sort by collection year (newest first)
        this.filteredProducts.sort((a, b) => 
          (b.collectionYear || 0) - (a.collectionYear || 0));
        break;
      case 'date-old':
        // Sort by collection year (oldest first)
        this.filteredProducts.sort((a, b) => 
          (a.collectionYear || 0) - (b.collectionYear || 0));
        break;
      case 'designer':
        // Sort by designer name
        this.filteredProducts.sort((a, b) => 
          (a.designer || '').localeCompare(b.designer || ''));
        break;
      default: // 'best-selling'
        // Sort by rating (best first) as a proxy for best-selling
        this.filteredProducts.sort((a, b) => 
          (b.averageRating || 0) - (a.averageRating || 0));
        break;
    }
  }

  getPrimaryImage(product: LuxuryDto): string {
    if (!product.images || product.images.length === 0) {
      return 'https://via.placeholder.com/300';
    }
    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage?.imageUrl || product.images[0].imageUrl;
  }

  getDisplayPrice(product: LuxuryDto): { price: number, originalPrice?: number } {
    return {
      price: product.salePrice || product.originalPrice,
      originalPrice: product.salePrice ? product.originalPrice : undefined
    };
  }

  resetFilters() {
    this.filteredProducts = [...this.products];
    this.totalProducts = this.products.length;
    this.sortProducts(this.sortOption);
  }
}