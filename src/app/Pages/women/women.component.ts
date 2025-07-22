import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductFiltersComponent } from '../products/product-filters/product-filters.component';
import { AllSuitsService } from '../../Services/all-suits.service';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [
    CommonModule,
    ProductFiltersComponent
  ],
  templateUrl: './women.component.html',
  styleUrl: './women.component.css'
})
export class WomenComponent  implements OnInit {
  suits: any[] = [];
  isLoading = true;

  constructor(private allSuitsService: AllSuitsService) {}

  ngOnInit(): void {
    this.allSuitsService.getAllSuits().subscribe({
      next: (data) => {
        this.suits = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching suits:', err);
        this.isLoading = false;
      }
    });
  }
  applyFilters() { 
    
  }
}