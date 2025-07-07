// src/app/hero-section-editor/hero-section-editor.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeroService } from '../../Services/hero.service';

@Component({
  selector: 'app-hero-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './hero-section-editor.component.html',
  styleUrls: ['./hero-section-editor.component.css']
})
export class HeroSectionEditorComponent implements OnInit {
  heroForm: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private heroService: HeroService,
    private fb: FormBuilder
  ) {
    this.heroForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      subtitle: ['', [Validators.maxLength(200)]],
      bannerImage: [null]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.heroService.getHeroSection().subscribe({
      next: (section) => {
        this.isLoading = false;
        if (section) {
          this.heroForm.patchValue({
            title: section.title,
            subtitle: section.subtitle
          });
          if (section.bannerImageBase64 && section.imageContentType) {
            // Ensure no double prefix in the data URL
            this.previewImage = this.getImageUrl(section.bannerImageBase64, section.imageContentType);
          }
        } else {
          this.error = 'Failed to load hero section';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Failed to load hero section';
      }
    });
  }

  private getImageUrl(base64?: string, contentType?: string): string | null {
    if (!base64 || !contentType) {
      return null;
    }
    // Check if base64 already includes data URL prefix
    if (base64.startsWith('data:')) {
      if (base64.startsWith(`data:${contentType};base64,`)) {
        return base64; // Use as-is if valid
      } else {
        console.warn('Invalid data URL prefix in base64 string:', base64);
        return null;
      }
    }
    // Construct data URL
    return `data:${contentType};base64,${base64}`;
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(this.selectedFile.type)) {
      this.heroForm.get('bannerImage')?.setErrors({ invalidType: true });
      this.error = 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
      return;
    }

    // Validate file size (max 5MB)
    if (this.selectedFile.size > 5 * 1024 * 1024) {
      this.heroForm.get('bannerImage')?.setErrors({ maxSize: true });
      this.error = 'File size exceeds 5MB limit.';
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage = e.target?.result as string;
      this.heroForm.get('bannerImage')?.setErrors(null);
      this.error = null;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  removeImage(): void {
    this.previewImage = null;
    this.selectedFile = null;
    this.heroForm.get('bannerImage')?.reset();
  }

  handleSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const formData = new FormData();
    formData.append('title', this.heroForm.get('title')?.value);
    formData.append('subtitle', this.heroForm.get('subtitle')?.value);

    if (this.selectedFile) {
      formData.append('bannerImage', this.selectedFile);
    } else if (this.previewImage && !this.selectedFile) {
      // Indicate to backend to keep existing image
      formData.append('keepExistingImage', 'true');
    }

    this.heroService.updateHeroSection(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          // Update preview with new data
          this.heroForm.patchValue({
            title: response.title,
            subtitle: response.subtitle
          });
          if (response.bannerImageBase64 && response.imageContentType) {
            this.previewImage = this.getImageUrl(response.bannerImageBase64, response.imageContentType);
          }
          this.selectedFile = null;
          this.heroForm.get('bannerImage')?.reset();
          alert('Hero section updated successfully!');
        } else {
          this.error = 'Failed to update hero section';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Failed to update hero section';
      }
    });
  }

  get title() {
    return this.heroForm.get('title');
  }

  get subtitle() {
    return this.heroForm.get('subtitle');
  }

  get bannerImage() {
    return this.heroForm.get('bannerImage');
  }
}