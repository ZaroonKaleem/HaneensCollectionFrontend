import { Component } from '@angular/core';
import { UnstitchedSuitService } from '../../Services/unstitched-suit.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private unstitchedService: UnstitchedSuitService) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.unstitchedService.getUnstitchedSuitById(productId!).subscribe((data) => {
      this.product = data;
    });
  }

  selectImage(imageUrl: string) {
  this.selectedImage = imageUrl;
}
}
