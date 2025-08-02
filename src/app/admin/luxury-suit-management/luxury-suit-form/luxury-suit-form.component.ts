import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { LuxuryService } from '../../../Services/luxury.service';
import { ImageUploadService } from '../../../Services/image-upload.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-luxury-suit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './luxury-suit-form.component.html',
  styleUrls: ['./luxury-suit-form.component.css']
})
export class LuxurySuitFormComponent {
  luxuryForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private luxuryService: LuxuryService,
    private imageUploadService: ImageUploadService,
    private location: Location
  ) {
    this.luxuryForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Luxury'],
      shortDescription: [''],
      designer: ['', Validators.required],
      collectionYear: [new Date().getFullYear()],
      authenticityCode: [''],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null, [Validators.min(0)]],
      salePercentage: [0],
      sizesAvailable: this.fb.array([], Validators.required),
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      colorOptions: this.fb.array([], Validators.required),
      material: ['', Validators.required],
      originCountry: [''],
      isLimitedEdition: [false],
      isNew: [false],
      isExclusive: [false],
      hasCertificate: [false],
      shippingInfo: [''],
      craftsmanshipDetails: [''],
      images: this.fb.array([], Validators.required),
      note: ['']
    });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.luxuryForm.get('originalPrice')?.valueChanges.subscribe(() => {
      this.calculateSalePrice();
    });

    this.luxuryForm.get('salePercentage')?.valueChanges.subscribe(() => {
      this.calculateSalePrice();
    });
  }

  private calculateSalePrice() {
    const originalPrice = parseFloat(this.luxuryForm.get('originalPrice')?.value);
    const salePercentage = parseFloat(this.luxuryForm.get('salePercentage')?.value);

    if (!isNaN(originalPrice)) {
      if (!isNaN(salePercentage)) {
        const discountAmount = originalPrice * (salePercentage / 100);
        const salePrice = originalPrice - discountAmount;
        this.luxuryForm.get('salePrice')?.setValue(salePrice.toFixed(2), { emitEvent: false });
      } else {
        this.luxuryForm.get('salePrice')?.setValue(null, { emitEvent: false });
      }
    }
  }

  get sizesAvailable(): FormArray {
    return this.luxuryForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.luxuryForm.get('colorOptions') as FormArray;
  }

  get images(): FormArray {
    return this.luxuryForm.get('images') as FormArray;
  }

  addSize(size: string) {
    if (size && size.trim()) {
      this.sizesAvailable.push(this.fb.control(size.trim()));
    }
  }

  addColor(color: string) {
    if (color && color.trim()) {
      this.colorOptions.push(this.fb.control(color.trim()));
    }
  }

  removeSize(index: number) {
    this.sizesAvailable.removeAt(index);
  }

  removeColor(index: number) {
    this.colorOptions.removeAt(index);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    this.selectedFiles = [];
    this.imagePreviews = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;
      
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  uploadImages() {
    if (this.selectedFiles.length === 0) return;

    this.uploadProgress = 0;
    const totalFiles = this.selectedFiles.length;
    let completedFiles = 0;

    const uploadTasks = this.selectedFiles.map((file, index) => {
      return this.imageUploadService.uploadImage(file).pipe(
        map(res => {
          completedFiles++;
          this.uploadProgress = Math.round((completedFiles / totalFiles) * 100);
          return {
            imageUrl: res.imageUrl,
            mimeType: res.mimeType,
            altText: file.name,
            isPrimary: index === 0 && this.images.length === 0
          };
        })
      );
    });

    forkJoin(uploadTasks).subscribe({
      next: (imageResults) => {
        imageResults.forEach(image => {
          this.images.push(this.fb.group(image));
        });
        
        this.selectedFiles = [];
        this.imagePreviews = [];
        this.uploadProgress = 0;
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Failed to upload some images. Please try again.');
        this.uploadProgress = 0;
      }
    });
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  removeSelectedImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  setPrimaryImage(index: number) {
    // Set all images to not primary first
    this.images.controls.forEach(control => {
      control.get('isPrimary')?.setValue(false);
    });
    
    // Set the selected image as primary
    this.images.at(index).get('isPrimary')?.setValue(true);
  }

  onSubmit() {
    if (this.luxuryForm.invalid || this.images.length === 0) {
      this.markAllAsTouched();
      alert('Please fill all required fields and upload at least one image.');
      return;
    }

    this.isSubmitting = true;

    // Prepare the product data
    const productData = {
      ...this.luxuryForm.value,
      productId: crypto.randomUUID(),
      sizesAvailable: this.sizesAvailable.value.filter((size: string) => size.trim() !== ''),
      colorOptions: this.colorOptions.value.filter((color: string) => color.trim() !== '')
    };

    this.luxuryService.createLuxury(productData).subscribe({
      next: res => {
        console.log('Luxury Product Submitted:', res);
        alert('Luxury product uploaded successfully!');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: err => {
        console.error('Submission failed:', err);
        alert('Failed to upload luxury product: ' + err.message);
        this.isSubmitting = false;
      }
    });
  }

  markAllAsTouched() {
    Object.values(this.luxuryForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          arrayControl.markAsTouched();
        });
      }
    });
  }

  resetForm() {
    this.luxuryForm.reset({
      category: 'Luxury',
      isLimitedEdition: false,
      isNew: false,
      isExclusive: false,
      hasCertificate: false,
      salePercentage: 0,
      stockQuantity: 0,
      collectionYear: new Date().getFullYear(),
      shippingInfo: ''
    });
    
    // Clear arrays
    while (this.sizesAvailable.length) {
      this.sizesAvailable.removeAt(0);
    }
    while (this.colorOptions.length) {
      this.colorOptions.removeAt(0);
    }
    while (this.images.length) {
      this.images.removeAt(0);
    }
    
    this.selectedFiles = [];
    this.imagePreviews = [];
    this.uploadProgress = 0;
  }
}