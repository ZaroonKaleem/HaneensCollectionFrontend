import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductFiltersComponent } from '../products/product-filters/product-filters.component';
import { StitchedSuitService } from '../../Services/stitched-suit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stitched',
  standalone: true,
  imports: [
         ProductFiltersComponent,
            CommonModule
  ],
  templateUrl: './stitched.component.html',
  styleUrl: './stitched.component.css'
})
export class StitchedComponent {
 stitchedSuits: any[] = [];
  totalProducts = 0;

  constructor(
    private stitchedSuitService: StitchedSuitService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStitchedSuits();
  }

  viewProductDetails(productId: string) {
  this.router.navigate(['/stitched', productId]);
}

  loadStitchedSuits() {
    this.stitchedSuitService.getAllStitchedSuits().subscribe({
      next: (data) => {
        this.stitchedSuits = data;
        this.totalProducts = data.length;
      },
      error: (err) => {
        console.error('Failed to load stitched suits', err);
      }
    });
  }

  applyFilters(filters: any) {
    // Implement filter logic here (optional)
    console.log('Filters applied:', filters);
  }
}
