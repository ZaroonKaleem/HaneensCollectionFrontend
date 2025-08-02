import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PretService } from '../../Services/pret.service';
import { ConfirmationDialogComponent } from "../../Common/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-pret-suit-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './pret-suit-management.component.html',
  styleUrl: './pret-suit-management.component.css'
})
export class PretSuitManagementComponent implements OnInit {
  suits: any[] = [];
  filteredSuits: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  suitToDelete: string | null = null;
  showConfirmDialog = false;

  constructor(
    private pretService: PretService,
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
      this.pretService.deletePret(this.suitToDelete).subscribe({
        next: () => {
          this.loadSuits();
        },
        error: (err) => {
          console.error('Error deleting PRET suit:', err);
        }
      });
    }
    this.suitToDelete = null;
  }

  loadSuits(): void {
    this.isLoading = true;
    this.pretService.getAllPret().subscribe({
      next: (data) => {
        this.suits = data;
        this.filteredSuits = [...this.suits];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading PRET suits:', err);
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
      suit.designName?.toLowerCase().includes(term) ||
      suit.collection?.toLowerCase().includes(term) ||
      suit.style?.toLowerCase().includes(term) ||
      suit.color?.toLowerCase().includes(term) ||
      suit.season?.toLowerCase().includes(term)
    );
  }

  editSuit(id: string): void {
    this.router.navigate(['/administrator/pret-suit/edit', id]);
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
    this.router.navigate(['/administrator/pret-suit/add']);
  }
}