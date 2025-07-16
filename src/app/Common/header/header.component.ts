import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../Services/cart.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CartComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
   isCartOpen = false;
  cartItemCount = 0;

   constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.itemCount;
    });
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
