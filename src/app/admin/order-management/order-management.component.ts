import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../Services/order.service';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

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
  selectedOrder: any = null;
  showEditDialog: boolean = false;
  newStatus: string = '';

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

  // Edit order methods
  openEditDialog(order: any): void {
    this.selectedOrder = order;
    this.newStatus = order.status;
    this.showEditDialog = true;
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.selectedOrder = null;
  }

// In your component
updateOrderStatus(): void {
  if (this.selectedOrder && this.newStatus !== this.selectedOrder.status) {
    this.isLoading = true; // Show loading state
    
    this.orderService.updateOrderStatus(this.selectedOrder.id, this.newStatus).subscribe({
      next: (updatedOrder) => {
        // Update the order in the local array
        const index = this.orders.findIndex(o => o.id === this.selectedOrder.id);
        if (index !== -1) {
          this.orders[index].status = this.newStatus;
          this.filteredOrders = [...this.orders];
          this.updatePagination();
        }
        this.isLoading = false;
        this.closeEditDialog();
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        this.isLoading = false;
        // Optionally show an error message to the user
      }
    });
  } else {
    this.closeEditDialog();
  }
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
      pages.push(1);
      
      if (this.currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  viewOrderDetails(order: any) {
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8';
    dialog.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 mx-4">
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0">
          <h3 class="text-xl font-bold text-gray-800">Order Details - #${order.orderNumber}</h3>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  class="text-gray-400 hover:text-gray-500 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <!-- Customer Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-3">Customer Information</h4>
              <div class="space-y-2 text-gray-600">
                <p class="flex items-start">
                  <span class="w-24 font-medium text-gray-700">Name:</span>
                  <span>${order.customerName}</span>
                </p>
                <p class="flex items-start">
                  <span class="w-24 font-medium text-gray-700">Email:</span>
                  <span class="break-all">${order.customerEmail}</span>
                </p>
                <p class="flex items-start">
                  <span class="w-24 font-medium text-gray-700">Phone:</span>
                  <span>${order.customerPhone}</span>
                </p>
              </div>
            </div>
            
            <!-- Order Info -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-3">Order Information</h4>
              <div class="space-y-2 text-gray-600">
                <p class="flex items-start">
                  <span class="w-24 font-medium text-gray-700">Date:</span>
                  <span>${new Date(order.orderDate).toLocaleString()}</span>
                </p>
                <p class="flex items-start">
                  <span class="w-24 font-medium text-gray-700">Payment:</span>
                  <span>${order.paymentMethod}</span>
                </p>
                <p class="flex items-start">
                  <span class="w-24 font-medium text-gray-700">Status:</span>
                  <span class="px-2 py-1 text-xs rounded-full ${this.getStatusClass(order.status)}">
                    ${order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Suit Details -->
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Suit Details</h4>
            <div class="space-y-4">
              ${order.items.map((item: any) => `
                <div class="flex flex-col sm:flex-row gap-4 p-4 rounded-lg hover:bg-gray-50">
                  ${item.imageUrl ? `
                    <div class="flex-shrink-0">
                      <img src="${item.imageUrl}" 
                           alt="${item.productName}"
                           class="h-32 w-32 object-contain rounded-md">
                    </div>
                  ` : ''}
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">${item.productName}</h5>
                    <p class="text-sm text-gray-500 mb-1">Product ID: ${item.productId}</p>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p class="text-sm text-gray-600">Price</p>
                        <p class="font-medium">₹${item.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Quantity</p>
                        <p class="font-medium">${item.quantity}</p>
                      </div>
                      <div class="col-span-2">
                        <p class="text-sm text-gray-600">Total</p>
                        <p class="font-medium">₹${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Order Summary</h4>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">₹${order.subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">₹${order.shippingCost.toFixed(2)}</span>
              </div>
              <div class="flex justify-between pt-3 border-t border-gray-200">
                <span class="text-lg font-semibold text-gray-800">Total</span>
                <span class="text-lg font-bold text-gray-900">₹${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(dialog);
  }

  getStatusClass(status: OrderStatus): string {
    const statusClasses: Record<OrderStatus, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }
}