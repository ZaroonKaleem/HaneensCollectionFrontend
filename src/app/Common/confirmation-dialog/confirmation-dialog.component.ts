// confirmation-dialog.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this suit? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button 
            (click)="onCancel()"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button 
            (click)="onConfirm()"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  standalone: true
})
export class ConfirmationDialogComponent {
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm() {
    console.log('Delete confirmed'); // Add this line
    this.confirmed.emit(true);
  }

  onCancel() {
    console.log('Delete canceled'); // Add this line
    this.confirmed.emit(false);
  }
}