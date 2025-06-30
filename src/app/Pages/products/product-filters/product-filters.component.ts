import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.css'
})
export class ProductFiltersComponent {
@Output() filtersApplied = new EventEmitter<any>();
  isModalOpen = false;

  // Filter options
  colors = [
    'Red', 'Brown', 'Blue', 'Black', 'Green'
  ];
  types = ['Embroidered', 'Printed', 'Solids'];
  pieces = ['1PC', '2PC', '3PC'];
  fabrics = [
    'Lawn', 'Cotton', 'Cambric', 'Net', 'Chiffon', 'Yarn Dyed', 'Jacquard',
    'Silk', 'Handmade Loom', 'Viscose', 'Swiss Lawn'
  ];
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'Standard'];
  priceRanges = ['3000-6000', '6000-9000', '9000-12000', 'Above 12000'];

  // Selected filters
  selectedFilters = {
    prices: {} as { [key: string]: boolean },
    colors: {} as { [key: string]: boolean },
    types: {} as { [key: string]: boolean },
    pieces: {} as { [key: string]: boolean },
    fabrics: {} as { [key: string]: boolean },
    sizes: {} as { [key: string]: boolean }
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  applyFilters() {
    this.filtersApplied.emit(this.selectedFilters);
    this.closeModal();
  }

  // Optional: Clear filters
  clearFilters() {
    this.selectedFilters = {
      prices: {},
      colors: {},
      types: {},
      pieces: {},
      fabrics: {},
      sizes: {}
    };
  }
}
