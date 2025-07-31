import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StitchedSuitService } from '../../Services/stitched-suit.service';
import { ConfirmationDialogComponent } from "../../Common/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-stitiched-suit-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './stitiched-suit-management.component.html',
  styleUrl: './stitiched-suit-management.component.css'
})
export class StitichedSuitManagementComponent implements OnInit {
  suits: any[] = [];
  filteredSuits: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  suitToDelete: string | null = null;
  showConfirmDialog = false;


  constructor(
    private suitService: StitchedSuitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuits();
  }

deleteSuit(id: string): void {
  console.log('Delete button clicked, id:', id); // Add this line
  this.suitToDelete = id;
  this.showConfirmDialog = true;
}

handleDeleteConfirmation(confirmed: boolean): void {
  console.log('Dialog response:', confirmed); // Add this line
  this.showConfirmDialog = false;
  if (confirmed && this.suitToDelete) {
    console.log('Deleting suit with id:', this.suitToDelete); // Add this line
    this.suitService.deleteStitchedSuit(this.suitToDelete).subscribe({
      next: () => {
        console.log('Delete successful'); // Add this line
        this.loadSuits();
      },
      error: (err) => {
        console.error('Error deleting suit:', err);
      }
    });
  }
  this.suitToDelete = null;
}

  loadSuits(): void {
    this.isLoading = true;
    this.suitService.getAllStitchedSuits().subscribe({
      next: (data) => {
        this.suits = data;
        this.filteredSuits = [...this.suits];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading suits:', err);
        this.isLoading = false;
      }
    });
  }

  filterSuits(): void {
    if (!this.searchTerm) {
      this.filteredSuits = [...this.suits];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredSuits = this.suits.filter(suit =>
      suit.name.toLowerCase().includes(term) ||
      suit.category.toLowerCase().includes(term) ||
      suit.material?.toLowerCase().includes(term) ||
      suit.shirt?.color?.toLowerCase().includes(term) ||
      suit.trouser?.color?.toLowerCase().includes(term)
    );
  }

editSuit(id: string): void {
  this.router.navigate(['/administrator/stitched-suit/edit', id]); // Make sure this matches your route
}

  // deleteSuit(id: string): void {
  //   if (confirm('Are you sure you want to delete this suit?')) {
  //     this.suitService.deleteStitchedSuit(id).subscribe({
  //       next: () => {
  //         this.loadSuits();
  //       },
  //       error: (err) => {
  //         console.error('Error deleting suit:', err);
  //       }
  //     });
  //   }
  // }
  // Add this helper function to your component class
getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

  addNewSuit(): void {
    this.router.navigate(['/administrator/stitched-suit/add']);
  }
}