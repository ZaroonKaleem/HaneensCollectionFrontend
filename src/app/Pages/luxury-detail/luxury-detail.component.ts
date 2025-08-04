import { Component } from '@angular/core';
import { LuxuryService } from '../../Services/luxury.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-luxury-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './luxury-detail.component.html',
  styleUrl: './luxury-detail.component.css'
})
export class LuxuryDetailComponent {
 product: any;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private luxuryService: LuxuryService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.luxuryService.getLuxuryById(productId!).subscribe((data) => {
      this.product = data;
    });
  }

  selectImage(imageUrl: string) {
  this.selectedImage = imageUrl;
  }
  
    addToCart(product: any): void {
    this.cartService.addToCart({
      id: product.productId,
      name: product.name,
      price: product.salePrice ?? product.originalPrice,
      quantity: 1,
      imageUrl: product.images?.[0]?.imageUrl || 'assets/placeholder.jpg'
    });
  }
}
