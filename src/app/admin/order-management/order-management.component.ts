import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  isLoading: boolean = true;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  Math = Math;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  filterOrders(): void {
    if (!this.searchTerm && !this.statusFilter) {
      this.filteredOrders = [...this.orders];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(order =>
        (order.orderNumber?.toLowerCase().includes(term) ||
        order.customerName?.toLowerCase().includes(term) ||
        order.customerEmail?.toLowerCase().includes(term)) &&
        (!this.statusFilter || order.status === this.statusFilter)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
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

  viewOrder(id: number): void {
    this.router.navigate(['/administrator/orders/view', id]);
  }

  editOrder(id: number): void {
    this.router.navigate(['/administrator/orders/edit', id]);
  }
}