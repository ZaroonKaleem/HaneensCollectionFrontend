import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StitchedSuitService } from '../../Services/stitched-suit.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stitched-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stitched-detail.component.html',
  styleUrl: './stitched-detail.component.css'
})
export class StitchedDetailComponent {
 product: any;

  constructor(private route: ActivatedRoute, private sttichedService: StitchedSuitService) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.sttichedService.getStitchedSuitById(productId!).subscribe((data) => {
      this.product = data;
    });
  }
}
