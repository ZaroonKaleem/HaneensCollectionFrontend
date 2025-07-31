import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StitchedSuitService } from '../../../Services/stitched-suit.service';
import { ImageUploadService } from '../../../Services/image-upload.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-stitched-suit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './stitched-suit-form.component.html',
})
export class StitchedSuitFormComponent implements OnInit {
  stitchedSuitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private imageUploadService: ImageUploadService,
    private stitchedSuitService: StitchedSuitService,
    private location: Location,
  ) {
    this.stitchedSuitForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      shortDescription: [''],
      originalPrice: [, Validators.required],
      salePrice: [],
      salePercentage: [],
      sizesAvailable: this.fb.array([]),
      stockQuantity: [],
      averageRating: [],
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

  ngOnInit(): void {
        this.setupPriceCalculations();
  }

  private setupPriceCalculations() {
    // Calculate sale price when originalPrice or salePercentage changes
    this.stitchedSuitForm.get('originalPrice')?.valueChanges.subscribe(() => this.calculateSalePrice());
    this.stitchedSuitForm.get('salePercentage')?.valueChanges.subscribe(() => this.calculateSalePrice());
  }

  private calculateSalePrice() {
    const originalPrice = this.stitchedSuitForm.get('originalPrice')?.value;
    const salePercentage = this.stitchedSuitForm.get('salePercentage')?.value;

    if (originalPrice && salePercentage) {
      const discountAmount = originalPrice * (salePercentage / 100);
      const salePrice = originalPrice - discountAmount;
      this.stitchedSuitForm.get('salePrice')?.setValue(salePrice.toFixed(2), { emitEvent: false });
    } else {
      this.stitchedSuitForm.get('salePrice')?.setValue(null, { emitEvent: false });
    }
  }

  goBack(): void {
  this.location.back();
  }
  
  get sizesAvailable(): FormArray {
    return this.stitchedSuitForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.stitchedSuitForm.get('colorOptions') as FormArray;
  }

  get images(): FormArray {
    return this.stitchedSuitForm.get('images') as FormArray;
  }

  addSize(size: string) {
    if (size) this.sizesAvailable.push(this.fb.control(size));
  }

  addColor(color: string) {
    if (color) this.colorOptions.push(this.fb.control(color));
  }

handleImageUpload(event: any) {
  const files: FileList = event.target.files;
  if (!files.length) return;

  Array.from(files).forEach((file, index) => {
    this.imageUploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.images.push(
          this.fb.group({
            imageId: this.generateUniqueId(), // If your backend needs this
            imageUrl: res.imageUrl,
            altText: '',
            isPrimary: this.images.length === 0, // First image is primary
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


  submitForm() {
      console.log('Form Value:', this.stitchedSuitForm.value); // Debug log

    if (this.stitchedSuitForm.invalid) return;

    const payload = this.stitchedSuitForm.value;
    this.stitchedSuitService.createStitchedSuit(payload).subscribe({
      next: res => {
        console.log('Stitched Suit Created:', res);
        alert('Product created successfully!');
        this.stitchedSuitForm.reset();
      },
      error: err => {
        console.error('Error creating stitched suit:', err);
        alert('Failed to create product. Please try again.');
      }
    });
  }
}
