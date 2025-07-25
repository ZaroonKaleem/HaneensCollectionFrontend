import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFiltersComponent } from '../products/product-filters/product-filters.component';

@Component({
  selector: 'app-pret',
  standalone: true,
  imports: [
 ProductFiltersComponent,
    CommonModule
  ],
  templateUrl: './pret.component.html',
  styleUrl: './pret.component.css'
})
export class PretComponent {
ngOnInit() {
    // this.filteredProducts = [...this.products]; // Initialize with all products
  }

  applyFilters(filters: any) {
    // this.filteredProducts = this.products.filter(product => {
    //   // Price filter
    //   const priceMatch = Object.keys(filters.prices).length === 0 || Object.keys(filters.prices).some(range => {
    //     if (!filters.prices[range]) return false;
    //     if (range === '3000-6000') return product.price >= 3000 && product.price <= 6000;
    //     if (range === '6000-9000') return product.price > 6000 && product.price <= 9000;
    //     if (range === '9000-12000') return product.price > 9000 && product.price <= 12000;
    //     if (range === 'Above 12000') return product.price > 12000;
    //     return false;
    //   });

    //   // Color filter
    //   const colorMatch = Object.keys(filters.colors).length === 0 || filters.colors[ Violated product.color];

    //   // Type filter
    //   const typeMatch = Object.keys(filters.types).length === 0 || filters.types[product.type];

    //   // Pieces filter
    //   const piecesMatch = Object.keys(filters.pieces).length === 0 || filters.pieces[product.pieces];

    //   // Fabric filter
    //   const fabricMatch = Object.keys(filters.fabrics).length === 0 || filters.fabrics[product.fabric];

    //   // Size filter
    //   const sizeMatch = Object.keys(filters.sizes).length === 0 || filters.sizes[product.size];

    //   return priceMatch && colorMatch && typeMatch && piecesMatch && fabricMatch && sizeMatch;
    // });
  }
}
