import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  orderNumber: string | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrder(orderId).subscribe({
        next: (order) => {
          this.orderNumber = order.orderNumber;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load order details', err);
          this.isLoading = false;
        }
      });
    }
  }
}