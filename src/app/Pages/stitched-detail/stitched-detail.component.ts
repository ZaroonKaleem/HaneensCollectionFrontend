import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StitchedSuitService } from '../../Services/stitched-suit.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-stitched-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stitched-detail.component.html',
  styleUrl: './stitched-detail.component.css'
})
export class StitchedDetailComponent {
  product: any;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private sttichedService: StitchedSuitService,
  private cartService: CartService) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.sttichedService.getStitchedSuitById(productId!).subscribe((data) => {
      this.product = data;
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart({
      id: product.productId,
      name: product.name,
      price: product.salePrice ?? product.originalPrice,
      quantity: 1,
      imageUrl: product.images?.[0]?.imageUrl || 'assets/placeholder.jpg'
    });
    // this.animateAddToCart(product.productId);
  }
  selectImage(imageUrl: string) {
  this.selectedImage = imageUrl;
}
}
