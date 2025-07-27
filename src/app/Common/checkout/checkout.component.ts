import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../Services/cart.service';
import { OrderService } from '../../Services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  cartTotal: number = 0;
  shippingCost: number = 200; // Default shipping cost
  checkoutForm: FormGroup;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    const cart = this.cartService.getCurrentCart();
    this.cartItems = cart.items;
    this.cartTotal = cart.total;
    this.calculateShipping();
  }

  calculateShipping(): void {
    // You can implement your shipping logic here
    // For example: Free shipping for orders over Rs. 2000
    this.shippingCost = this.cartTotal > 2000 ? 0 : 200;
  }

 placeOrder() {
  const orderData = {
    CustomerName: this.checkoutForm.value.name,
    CustomerEmail: this.checkoutForm.value.email,
    CustomerPhone: this.checkoutForm.value.phone,
    ShippingAddress: this.checkoutForm.value.address,
    Items: this.cartItems.map(item => ({
      ProductId: item.productId,
      ProductName: item.name,
      Price: item.price,
      Quantity: item.quantity,
      ImageUrl: item.imageUrl || 'assets/placeholder.jpg'
    })),
    Subtotal: this.cartTotal,
    ShippingCost: this.shippingCost,
    Total: this.cartTotal + this.shippingCost
  };

  this.orderService.createOrder(orderData).subscribe({
    next: (response) => {
      // Handle success
    },
    error: (err) => {
      console.error('Order failed:', err);
    }
  });
}
}