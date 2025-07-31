// unstitched-suit-management.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UnstitchedSuitService } from '../../Services/unstitched-suit.service';
import { ConfirmationDialogComponent } from "../../Common/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-unstitched-suit-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './unstitched-suit-management.component.html',
  styleUrl: './unstitched-suit-management.component.css'
})
export class UnstitchedSuitManagementComponent implements OnInit {
  suits: any[] = [];
  filteredSuits: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  suitToDelete: string | null = null;
  showConfirmDialog = false;

  constructor(
    private suitService: UnstitchedSuitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuits();
  }

  deleteSuit(id: string): void {
    this.suitToDelete = id;
    this.showConfirmDialog = true;
  }

  handleDeleteConfirmation(confirmed: boolean): void {
    this.showConfirmDialog = false;
    if (confirmed && this.suitToDelete) {
      this.suitService.deleteUnstitchedSuit(this.suitToDelete).subscribe({
        next: () => {
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
    this.suitService.getAllUnstitchedSuits().subscribe({
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
      suit.fabric?.toLowerCase().includes(term) ||
      suit.color?.toLowerCase().includes(term)
    );
  }

  editSuit(id: string): void {
    this.router.navigate(['/administrator/unstitched-suit/edit', id]);
  }

  getContrastColor(hexColor: string): string {
    if (!hexColor) return '#000000';
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  addNewSuit(): void {
    this.router.navigate(['/administrator/unstitched-suit/add']);
  }
}