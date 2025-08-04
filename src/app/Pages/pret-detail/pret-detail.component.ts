import { Component } from '@angular/core';
import { PretService } from '../../Services/pret.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-pret-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pret-detail.component.html',
  styleUrl: './pret-detail.component.css'
})
export class PretDetailComponent {
 product: any;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private pretService: PretService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.pretService.getPretById(productId!).subscribe((data) => {
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
