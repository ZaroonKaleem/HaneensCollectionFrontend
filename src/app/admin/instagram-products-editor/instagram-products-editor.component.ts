import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { InstagramPostService } from '../../Services/instagram-post.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instagram-products-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './instagram-products-editor.component.html',
  styleUrls: ['./instagram-products-editor.component.css']
})
export class InstagramProductsEditorComponent {
  post = { image: null as File | null, link: '' };
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' | null = null;
  uploadProgress = 0;

  constructor(private instagramPostService: InstagramPostService) {}

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.post.image = input.files[0];
    }
  }

  onLinkChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.post.link = input.value;
  }

  getImagePreview(file: File | null): string {
    if (!file) return '';
    return URL.createObjectURL(file);
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isFormValid(): boolean {
    return !!this.post.image && !!this.post.link && this.isValidUrl(this.post.link);
  }

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent default form submission
    event.stopPropagation(); // Stop event bubbling

    console.log('Form submitted'); // Debugging

    if (!this.isFormValid()) {
      this.message = 'Please fill all fields with valid data';
      this.messageType = 'error';
      console.log('Form invalid:', this.post); // Debugging
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.messageType = null;
    this.uploadProgress = 0;

    this.instagramPostService.uploadPost(this.post.image as File, this.post.link)
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
            console.log('Upload progress:', this.uploadProgress); // Debugging
          } else if (event.type === HttpEventType.Response) {
            this.handleSuccess();
            console.log('Upload successful:', event.body); // Debugging
          }
        },
        error: (error) => {
          this.handleError(error);
          console.error('Upload error:', error); // Debugging
        },
        complete: () => {
          console.log('Upload complete'); // Debugging
        }
      });
  }

  private handleSuccess(): void {
    this.isSubmitting = false;
    this.message = 'Post uploaded successfully!';
    this.messageType = 'success';
    // Optional: reset form after success
    // this.resetForm();
  }

  private handleError(error: any): void {
    this.isSubmitting = false;
    this.message = `Error uploading post: ${error.error?.message || error.message}`;
    this.messageType = 'error';
  }

  resetForm(): void {
    this.post = { image: null, link: '' };
    this.messageType = null;
    this.uploadProgress = 0;
  }
}