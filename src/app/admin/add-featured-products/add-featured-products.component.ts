import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { FeaturedProductsService, FeaturedProductDto } from '../../Services/featured-products.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { cloudinaryConfig } from '../../../../cloudinary.config';
import { generateGuid } from '../../guid.utility';

@Component({
  selector: 'app-add-featured-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-featured-products.component.html',
  styleUrl: './add-featured-products.component.css'
})
export class AddFeaturedProductsComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  message: { type: 'success' | 'error' | null, text: string } = { type: null, text: '' };
  isLoading: boolean = false;
  private subscriptions: Subscription = new Subscription();
  pendingImageUploads: number = 0;
  uploadErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: FeaturedProductsService,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      productId: [generateGuid(), Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      shortDescription: ['', Validators.maxLength(900)],
      originalPrice: [0, [Validators.required, Validators.min(0.01)]],
      salePercentage: [null, [Validators.min(0), Validators.max(100)]],
      salePrice: [{ value: null, disabled: true }, Validators.min(0)],
      sizesAvailable: this.fb.array([], Validators.required),
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      averageRating: [null, [Validators.min(0), Validators.max(5)]],
      ratingCount: [0, [Validators.min(0)]],
      colorOptions: this.fb.array([], Validators.required),
      material: ['', Validators.maxLength(100)],
      isNew: [false],
      isExclusive: [false],
      shippingInfo: ['', Validators.maxLength(200)],
      images: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.addSize();
    this.addColor();
    this.addImage();

    const originalPriceControl = this.productForm.get('originalPrice');
    const salePercentageControl = this.productForm.get('salePercentage');
    this.subscriptions.add(
      originalPriceControl?.valueChanges.subscribe(() => this.calculateSalePrice())
    );
    this.subscriptions.add(
      salePercentageControl?.valueChanges.subscribe(() => this.calculateSalePrice())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateSalePrice(): void {
    const originalPrice = this.productForm.get('originalPrice')?.value;
    const salePercentage = this.productForm.get('salePercentage')?.value;
    const salePriceControl = this.productForm.get('salePrice');

    if (originalPrice != null && salePercentage != null && salePercentage >= 0 && salePercentage <= 100) {
      const salePrice = originalPrice * (1 - salePercentage / 100);
      salePriceControl?.setValue(Number(salePrice.toFixed(2)), { emitEvent: false });
    } else {
      salePriceControl?.setValue(null, { emitEvent: false });
    }
  }

  get sizesAvailable(): FormArray {
    return this.productForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.productForm.get('colorOptions') as FormArray;
  }

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  addSize(): void {
    this.sizesAvailable.push(this.fb.control('', Validators.required));
  }

  removeSize(index: number): void {
    if (this.sizesAvailable.length > 1) {
      this.sizesAvailable.removeAt(index);
    }
  }

  addColor(): void {
    this.colorOptions.push(this.fb.control('', Validators.required));
  }

  removeColor(index: number): void {
    if (this.colorOptions.length > 1) {
      this.colorOptions.removeAt(index);
    }
  }

  addImage(): void {
    this.images.push(this.fb.group({
      imageId: [generateGuid(), Validators.required],
      imageUrl: [null, Validators.required],
      altText: ['', Validators.maxLength(200)],
      isPrimary: [false],
      mimeType: ['image/jpeg', [Validators.required, Validators.maxLength(50)]]
    }));
  }

  removeImage(index: number): void {
    if (this.images.length > 1) {
      this.images.removeAt(index);
    }
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.images.at(index).patchValue({
        imageUrl: file,
        mimeType: file.type
      });
    }
  }

  async onSubmit(): Promise<void> {
    this.message = { type: null, text: '' };
    if (this.productForm.valid) {
      this.isLoading = true;
      this.uploadErrors = [];
      this.pendingImageUploads = 0;

      // First upload all images
      const uploadPromises: Promise<void>[] = [];
      
      for (let i = 0; i < this.images.length; i++) {
        const imageGroup = this.images.at(i);
        const imageUrl = imageGroup.get('imageUrl')?.value;
        
        // If the image is a File object (not yet uploaded)
        if (imageUrl instanceof File) {
          this.pendingImageUploads++;
          uploadPromises.push(this.uploadImageAndUpdateForm(imageUrl, i));
        } else if (!imageUrl) {
          // If no image is provided
          this.uploadErrors.push(`Image ${i + 1} is required`);
        }
      }

      if (this.uploadErrors.length > 0) {
        this.isLoading = false;
        this.message = { type: 'error', text: this.uploadErrors.join(', ') };
        return;
      }

      try {
        // Wait for all image uploads to complete
        await Promise.all(uploadPromises);
        
        // If any uploads failed
        if (this.uploadErrors.length > 0) {
          this.isLoading = false;
          this.message = { type: 'error', text: this.uploadErrors.join(', ') };
          return;
        }

        // Now create the product
        this.createProduct();
      } catch (error) {
        this.isLoading = false;
        this.message = { type: 'error', text: 'Failed to upload images' };
      }
    } else {
      this.productForm.markAllAsTouched();
      this.message = { type: 'error', text: 'Please fill all required fields correctly, including uploading images.' };
    }
  }

  private uploadImageAndUpdateForm(file: File, index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!file) {
        this.uploadErrors.push(`No file selected for image ${index + 1}`);
        this.pendingImageUploads--;
        reject(new Error('No file selected'));
        return;
      }
      console.log('Uploading file:', file.name, file.type, file.size);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      formData.append('cloud_name', cloudinaryConfig.cloudName);

      this.http.post(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, formData)
        .pipe(timeout(30000)) // 30-second timeout
        .subscribe({
          next: (response: any) => {
            console.log('Upload response:', response);
            this.images.at(index).patchValue({
              imageUrl: response.secure_url,
              mimeType: file.type
            });
            this.pendingImageUploads--;
            resolve();
          },
          error: (error) => {
            console.error('Upload error:', error);
            this.uploadErrors.push(`Failed to upload image ${index + 1}: ${error.message || error.statusText}`);
            this.pendingImageUploads--;
            reject(error);
          }
        });
    });
  }

  private createProduct(): void {
    const product: FeaturedProductDto = {
      ...this.productForm.getRawValue(),
      images: this.images.controls.map(control => ({
        imageId: control.get('imageId')?.value,
        imageUrl: control.get('imageUrl')?.value,
        altText: control.get('altText')?.value,
        isPrimary: control.get('isPrimary')?.value,
        mimeType: control.get('mimeType')?.value
      }))
    };

    this.productService.createFeaturedProduct(product).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.message = { type: 'success', text: 'Product created successfully!' };
      },
      error: (error) => {
        this.isLoading = false;
        this.message = { type: 'error', text: error.message };
      }
    });
  }

  resetForm(): void {
    this.productForm.reset({
      productId: generateGuid(),
      name: '',
      category: '',
      shortDescription: '',
      originalPrice: 0,
      salePercentage: null,
      salePrice: null,
      stockQuantity: 0,
      averageRating: null,
      ratingCount: 0,
      material: '',
      isNew: false,
      isExclusive: false,
      shippingInfo: ''
    });
    this.sizesAvailable.clear();
    this.colorOptions.clear();
    this.images.clear();
    this.addSize();
    this.addColor();
    this.addImage();
    this.message = { type: null, text: '' };
    this.isLoading = false;
    this.uploadErrors = [];
    this.pendingImageUploads = 0;
  }
}