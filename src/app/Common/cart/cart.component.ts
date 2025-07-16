import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../Services/cart.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
   animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(0)'
      })),
      state('closed', style({
        transform: 'translateX(100%)'
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('fadeInOut', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out')
      ])
    ])
  ],
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnChanges {
 @Input() isOpen = false;
  @Output() closeCart = new EventEmitter<void>();

  constructor(public cartService: CartService) {}

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.closeCart.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (changes['isOpen'].currentValue) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;
    this.cartService.updateQuantity(item.id, newQuantity);
  }
}