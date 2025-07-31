import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UnstitchedSuitService } from '../../../Services/unstitched-suit.service';
import { ImageUploadService } from '../../../Services/image-upload.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-unstitched-suit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './unstitched-suit-form.component.html',
  styleUrl: './unstitched-suit-form.component.css'
})
export class UnstitchedSuitFormComponent implements OnInit {
  suitForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private unstitchedSuitService: UnstitchedSuitService,
    private imageUploadService: ImageUploadService
  ) {
    this.suitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['Unstitched', Validators.required],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null],
      salePercentage: [null],
      sizesAvailable: this.fb.array([], Validators.required),
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      averageRating: [null, [Validators.min(0), Validators.max(5)]],
      ratingCount: [null, [Validators.min(0)]],
      colorOptions: this.fb.array([], Validators.required),
      material: ['', Validators.required],
      isNew: [false],
      isExclusive: [false],
      shippingInfo: ['', Validators.required],
      images: this.fb.array([]),
      shirt: this.fb.group({
        embroideredNeckline: [''],
        digitalPrint: [''],
        embroideredBorder: [''],
        fabric: [''],
        color: ['']
      }),
      dupatta: this.fb.group({
        digitalPrint: [''],
        fabric: [''],
        color: ['']
      }),
      trouser: this.fb.group({
        description: [''],
        fabric: [''],
        color: ['']
      }),
      note: ['']
    });
  }

  ngOnInit(): void {
    this.suitForm.get('originalPrice')?.valueChanges.subscribe(() => {
      this.calculateSalePrice();
    });

    this.suitForm.get('salePercentage')?.valueChanges.subscribe(() => {
      this.calculateSalePrice();
    });
  }

  private calculateSalePrice() {
    const originalPrice = parseFloat(this.suitForm.get('originalPrice')?.value);
    const salePercentage = parseFloat(this.suitForm.get('salePercentage')?.value);

    if (!isNaN(originalPrice)) {
      if (!isNaN(salePercentage)) {
        const discountAmount = originalPrice * (salePercentage / 100);
        const salePrice = originalPrice - discountAmount;
        this.suitForm.get('salePrice')?.setValue(salePrice.toFixed(2), { emitEvent: false });
      } else {
        this.suitForm.get('salePrice')?.setValue(null, { emitEvent: false });
      }
    }
  }

  // Form array getters
  get sizesAvailable(): FormArray {
    return this.suitForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.suitForm.get('colorOptions') as FormArray;
  }

  get images(): FormArray {
    return this.suitForm.get('images') as FormArray;
  }

  // Add size to form array
  addSize(size: string) {
    if (size && size.trim()) {
      this.sizesAvailable.push(this.fb.control(size.trim()));
    }
  }

  // Add color to form array
  addColor(color: string) {
    if (color && color.trim()) {
      this.colorOptions.push(this.fb.control(color.trim()));
    }
  }

  // Remove size from form array
  removeSize(index: number) {
    this.sizesAvailable.removeAt(index);
  }

  // Remove color from form array
  removeColor(index: number) {
    this.colorOptions.removeAt(index);
  }

  // Remove image from preview and form array
  removeImage(index: number) {
    this.images.removeAt(index);
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  // Handle image selection and preview
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files.length) return;

    // Add new files to selectedFiles array
    Array.from(files).forEach(file => {
      this.selectedFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // Handle image upload
  handleImageUpload() {
    if (this.selectedFiles.length === 0) return;

    const uploadTasks = this.selectedFiles.map((file, index) => {
      return this.imageUploadService.uploadImage(file).pipe(
        map(res => ({
          imageUrl: res.imageUrl,
          mimeType: res.mimeType,
          altText: file.name,
          isPrimary: index === 0 && this.images.length === 0 // First image is primary if no images exist
        }))
      );
    });

    forkJoin(uploadTasks).subscribe({
      next: (imageResults) => {
        // Clear existing images if needed
        while (this.images.length) {
          this.images.removeAt(0);
        }
        
        // Add all uploaded images to form array
        imageResults.forEach(image => {
          this.images.push(this.fb.group(image));
        });
        
        // Clear previews and selected files
        this.imagePreviews = [];
        this.selectedFiles = [];
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Failed to upload some images. Please try again.');
      }
    });
  }

  // Form submission
  onSubmit() {
    this.suitForm.markAllAsTouched();

    if (this.suitForm.invalid) {
      this.showFormErrors();
      return;
    }

    // If we have selected files but haven't uploaded them yet
    if (this.selectedFiles.length > 0) {
      this.handleImageUpload();
      alert('Please wait for images to finish uploading before submitting');
      return;
    }

    if (this.images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.suitForm.value;
    const unstitchedSuit = {
      ...formValue,
      productId: crypto.randomUUID(),
      images: this.images.value
    };

    this.unstitchedSuitService.createUnstitchedSuit(unstitchedSuit).subscribe({
      next: (res) => {
        console.log('Submitted:', res);
        alert('Unstitched suit uploaded successfully!');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Submission failed:', err);
        alert('Failed to upload suit. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  // Show form validation errors
  private showFormErrors() {
    const errors = [];
    
    if (this.suitForm.get('name')?.invalid) {
      errors.push('Product Name is required (min 3 characters)');
    }
    if (this.sizesAvailable.length === 0) {
      errors.push('At least one size is required');
    }
    if (this.colorOptions.length === 0) {
      errors.push('At least one color is required');
    }
    if (this.suitForm.get('material')?.invalid) {
      errors.push('Material is required');
    }
    if (this.suitForm.get('stockQuantity')?.invalid) {
      errors.push('Valid stock quantity is required');
    }
    if (this.suitForm.get('shippingInfo')?.invalid) {
      errors.push('Shipping info is required');
    }
    if (this.suitForm.get('shortDescription')?.invalid) {
      errors.push('Short description is required (min 10 characters)');
    }
    if (this.suitForm.get('originalPrice')?.invalid) {
      errors.push('Valid original price is required');
    }
    if (this.images.length === 0 && this.selectedFiles.length === 0) {
      errors.push('At least one image is required');
    }
    
    alert('Please fix the following errors:\n\n' + errors.join('\n'));
  }

  // Reset form after submission
  private resetForm() {
    this.suitForm.reset({
      category: 'Unstitched',
      isNew: false,
      isExclusive: false
    });
    
    // Clear FormArrays and previews
    while (this.images.length) this.images.removeAt(0);
    while (this.sizesAvailable.length) this.sizesAvailable.removeAt(0);
    while (this.colorOptions.length) this.colorOptions.removeAt(0);
    this.imagePreviews = [];
    this.selectedFiles = [];
  }
}