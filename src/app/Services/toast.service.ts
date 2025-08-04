// toast.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() {}

  showSuccess(message: string, duration: number = 3000): void {
    this.showToast(message, 'success', duration);
  }

  showError(message: string, duration: number = 3000): void {
    this.showToast(message, 'error', duration);
  }

  private showToast(message: string, type: 'success' | 'error', duration: number): void {
    // Remove existing toasts if any
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast-${type}`;
    toast.textContent = message;

    // Style the toast
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.color = 'white';
    toast.style.zIndex = '1000';
    toast.style.transition = 'opacity 0.3s ease-in-out';
    toast.style.opacity = '0';

    // Add specific styles based on type
    if (type === 'success') {
      toast.style.backgroundColor = '#8E7BEE'; // Green
    } else {
      toast.style.backgroundColor = '#F44336'; // Red
    }

    // Add to DOM
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    // Remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }
}