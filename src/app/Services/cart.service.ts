// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './toast.service';

// cart-item.interface.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// cart-state.interface.ts
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartState>({
    items: [],
    total: 0,
    itemCount: 0
  });

  cart$: Observable<CartState> = this.cartSubject.asObservable();

  constructor(private toastService: ToastService) {}

  // Add item to cart or increment quantity if already exists
  addToCart(item: CartItem): void {
    const currentState = this.cartSubject.value;
    const existingItem = currentState.items.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentState.items.push({ ...item, quantity: 1 });
    }

    this.updateCartState(currentState.items);
    this.toastService.showSuccess(`${item.name} added to cart!`);
  }

  // Remove item from cart
  removeFromCart(productId: string): void {
    const currentState = this.cartSubject.value;
    const updatedItems = currentState.items.filter(item => item.id !== productId);
    this.updateCartState(updatedItems);
  }

  // Update item quantity
  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    const currentState = this.cartSubject.value;
    const itemToUpdate = currentState.items.find(item => item.id === productId);

    if (itemToUpdate) {
      itemToUpdate.quantity = newQuantity;
      this.updateCartState(currentState.items);
    }
  }

  // Clear the entire cart
  clearCart(): void {
    this.updateCartState([]);
  }

  // Helper method to calculate totals and emit new state
  private updateCartState(items: CartItem[]): void {
    const total = this.calculateTotal(items);
    const itemCount = this.calculateItemCount(items);
    
    this.cartSubject.next({
      items: [...items],
      total,
      itemCount
    });
  }

  // Calculate total cart value
  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Calculate total number of items in cart
  private calculateItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  // Get current cart snapshot
  getCurrentCart(): CartState {
    return this.cartSubject.value;
  }
}