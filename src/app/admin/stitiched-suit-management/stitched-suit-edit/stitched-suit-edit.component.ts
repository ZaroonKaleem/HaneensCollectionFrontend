import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploadService } from '../../../Services/image-upload.service';
import { StitchedSuitService } from '../../../Services/stitched-suit.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stitched-suit-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './stitched-suit-edit.component.html',
  styleUrl: './stitched-suit-edit.component.css'
})
export class StitchedSuitEditComponent implements OnInit {
  stitchedSuitForm: FormGroup;
  productId: string = '';
  isEditMode = true;

  constructor(
    private fb: FormBuilder,
    private imageUploadService: ImageUploadService,
    private stitchedSuitService: StitchedSuitService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.stitchedSuitForm = this.initForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = id;
      this.loadSuitData();
    } else {
      console.error('No product ID found in route');
      this.router.navigate(['/stitched-suits']);
    }
  }

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
  
  private initForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      shortDescription: [''],
      originalPrice: [0.01, Validators.required],
      salePrice: [0.01],
      salePercentage: [0],
      sizesAvailable: this.fb.array([]),
      stockQuantity: [0],
      averageRating: [5],
      ratingCount: [0],
      colorOptions: this.fb.array([]),
      material: [''],
      isNew: [false],
      isExclusive: [false],
      shippingInfo: [''],
      images: this.fb.array([]),
      categoryType: [''],
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

  // Getter methods for form arrays
  get sizesAvailable(): FormArray {
    return this.stitchedSuitForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.stitchedSuitForm.get('colorOptions') as FormArray;
  }

  get images(): FormArray {
    return this.stitchedSuitForm.get('images') as FormArray;
  }

  loadSuitData(): void {
    this.stitchedSuitService.getStitchedSuitById(this.productId).subscribe({
      next: (suit) => {
        this.populateForm(suit);
      },
      error: (err) => {
        console.error('Error loading suit:', err);
        this.router.navigate(['/administrator/stitched-suit-management']);
      }
    });
  }

  populateForm(suit: any): void {
    // Clear existing arrays
    this.clearFormArray(this.sizesAvailable);
    this.clearFormArray(this.colorOptions);
    this.clearFormArray(this.images);

    // Patch basic values with null checks
    this.stitchedSuitForm.patchValue({
      name: suit.name || '',
      category: suit.category || '',
      shortDescription: suit.shortDescription || '',
      originalPrice: suit.originalPrice || 0.01,
      salePrice: suit.salePrice || 0.01,
      salePercentage: suit.salePercentage || 0,
      stockQuantity: suit.stockQuantity || 0,
      averageRating: suit.averageRating || 5,
      ratingCount: suit.ratingCount || 0,
      material: suit.material || '',
      isNew: suit.isNew || false,
      isExclusive: suit.isExclusive || false,
      shippingInfo: suit.shippingInfo || '',
      categoryType: suit.categoryType || '',
      shirt: suit.shirt || {},
      dupatta: suit.dupatta || {},
      trouser: suit.trouser || {},
      note: suit.note || ''
    });

    // Add array values with null checks
    (suit.sizesAvailable || []).forEach((size: string) => this.addSize(size));
    (suit.colorOptions || []).forEach((color: string) => this.addColor(color));
    (suit.images || []).forEach((image: any) => this.addExistingImage(image));
  }

  clearFormArray(formArray: FormArray): void {
    while (formArray.length) {
      formArray.removeAt(0);
    }
  }

  addSize(size: string): void {
    if (size) {
      this.sizesAvailable.push(this.fb.control(size));
    }
  }

  addColor(color: string): void {
    if (color) {
      this.colorOptions.push(this.fb.control(color));
    }
  }

  addExistingImage(image: any): void {
    if (image?.imageUrl) {
      this.images.push(this.fb.group({
        imageId: image.imageId || this.generateUniqueId(),
        imageUrl: image.imageUrl,
        altText: image.altText || '',
        isPrimary: image.isPrimary || false,
        mimeType: image.mimeType || 'image/jpeg'
      }));
    }
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    Array.from(input.files).forEach((file) => {
      this.imageUploadService.uploadImage(file).subscribe({
        next: (res) => {
          this.images.push(
            this.fb.group({
              imageId: this.generateUniqueId(),
              imageUrl: res.imageUrl,
              altText: '',
              isPrimary: this.images.length === 0,
              mimeType: res.mimeType
            })
          );
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          alert(`Failed to upload image: ${file.name}`);
        }
      });
    });
  }

  private generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  submitForm(): void {
    if (this.stitchedSuitForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const payload = this.stitchedSuitForm.value;
    this.stitchedSuitService.updateStitchedSuit(this.productId, payload).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/stitched-suits']);
      },
      error: (err) => {
        console.error('Error updating suit:', err);
        alert('Failed to update product. Please try again.');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}