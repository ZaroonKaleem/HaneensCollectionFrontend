import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cart.service';
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
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  cartTotal: number = 0;
  shippingCost: number = 200;
  checkoutForm: FormGroup;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      shippingAddress: ['', Validators.required],
      paymentMethod: ['CashOnDelivery', Validators.required]
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
    this.shippingCost = this.cartTotal > 2000 ? 0 : 200;
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    const orderData = {
      customerName: this.checkoutForm.value.customerName,
      customerEmail: this.checkoutForm.value.customerEmail,
      customerPhone: this.checkoutForm.value.customerPhone,
      shippingAddress: this.checkoutForm.value.shippingAddress,
      paymentMethod: this.checkoutForm.value.paymentMethod,
      items: this.cartItems.map(item => ({
        productId: item.productId || 'default-id',
        productName: item.name || 'Unnamed Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
        imageUrl: item.imageUrl || 'assets/placeholder.jpg'
      })),
      subtotal: this.cartTotal,
      shippingCost: this.shippingCost,
      total: this.cartTotal + this.shippingCost
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation', response.id]);
      },
      error: (err) => {
        console.error('Order failed:', err);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}