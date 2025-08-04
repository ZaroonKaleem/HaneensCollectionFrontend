import { Component } from '@angular/core';
import { UnstitchedSuitService } from '../../Services/unstitched-suit.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-unstitched-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './unstitched-detail.component.html',
  styleUrl: './unstitched-detail.component.css'
})
export class UnstitchedDetailComponent {
 product: any;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private unstitchedService: UnstitchedSuitService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.unstitchedService.getUnstitchedSuitById(productId!).subscribe((data) => {
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
