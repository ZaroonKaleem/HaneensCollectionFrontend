import { Component } from '@angular/core';
import { LuxuryService } from '../../Services/luxury.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private luxuryService: LuxuryService ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.luxuryService.getLuxuryById(productId!).subscribe((data) => {
      this.product = data;
    });
  }

  selectImage(imageUrl: string) {
  this.selectedImage = imageUrl;
}
}
