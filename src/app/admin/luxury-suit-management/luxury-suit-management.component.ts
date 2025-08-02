import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LuxuryService } from '../../Services/luxury.service';
import { ConfirmationDialogComponent } from "../../Common/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-luxury-suit-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './luxury-suit-management.component.html',
  styleUrls: ['./luxury-suit-management.component.css']
})
export class LuxurySuitManagementComponent implements OnInit {
  Math = Math;
  suits: any[] = [];
  filteredSuits: any[] = [];
  paginatedProducts: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  suitToDelete: string | null = null;
  showConfirmDialog = false;
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private luxuryService: LuxuryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuits();
  }

  loadSuits(): void {
    this.isLoading = true;
    this.luxuryService.getAllLuxury().subscribe({
      next: (data) => {
        this.suits = data;
        this.filteredSuits = [...this.suits];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading Luxury suits:', err);
        this.isLoading = false;
      }
    });
  }

  filterSuits(): void {
    if (!this.searchTerm) {
      this.filteredSuits = [...this.suits];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSuits = this.suits.filter(suit =>
        suit.name?.toLowerCase().includes(term) ||
        suit.category?.toLowerCase().includes(term) ||
        suit.material?.toLowerCase().includes(term) ||
        suit.colorOptions?.some((color: string) => color.toLowerCase().includes(term)) ||
        suit.shortDescription?.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSuits.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredSuits.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

goToPage(page: number | string): void {
  if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updatePagination();
  }
}

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Show ellipsis if current page is far from start
      if (this.currentPage > 3) {
        pages.push('...');
      }
      
      // Show current page and neighbors
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Show ellipsis if current page is far from end
      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  // Rest of your existing methods...
  deleteSuit(id: string): void {
    this.suitToDelete = id;
    this.showConfirmDialog = true;
  }

  handleDeleteConfirmation(confirmed: boolean): void {
    this.showConfirmDialog = false;
    if (confirmed && this.suitToDelete) {
      this.luxuryService.deleteLuxury(this.suitToDelete).subscribe({
        next: () => {
          this.loadSuits();
        },
        error: (err) => {
          console.error('Error deleting Luxury suit:', err);
        }
      });
    }
    this.suitToDelete = null;
  }

  editSuit(id: string): void {
    this.router.navigate(['/administrator/luxury-suit/edit', id]);
  }

  getContrastColor(hexColor: string): string {
    if (!hexColor) return '#000000';
    // Handle color names if hex code isn't provided
    if (!hexColor.startsWith('#')) {
      const tempElement = document.createElement('div');
      tempElement.style.color = hexColor;
      document.body.appendChild(tempElement);
      const computedColor = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);
      
      // Extract RGB values from computed color
      const rgbMatch = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
      }
      return '#000000';
    }
    
    // Handle hex colors
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  addNewSuit(): void {
    this.router.navigate(['/administrator/luxury-suit/add']);
  }
}