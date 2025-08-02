import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { PretService } from '../../../Services/pret.service';
import { ImageUploadService } from '../../../Services/image-upload.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-pret-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pret-suit-form.component.html',
  styleUrls: ['./pret-suit-form.component.css']
})
export class PretSuitFormComponent {
  pretForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private pretService: PretService,
    private imageUploadService: ImageUploadService,
    private location: Location
  ) {
    this.pretForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Pret'],
      shortDescription: [''],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null, [Validators.required, Validators.min(0)]],
      salePercentage: [0],
      sizesAvailable: this.fb.array([], Validators.required),
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      averageRating: [5],
      ratingCount: [0],
      colorOptions: this.fb.array([], Validators.required),
      material: [''],
      isNew: [false],
      isExclusive: [false],
      shippingInfo: [''],
      images: this.fb.array([], Validators.required),
      note: ['']
    });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.pretForm.get('originalPrice')?.valueChanges.subscribe(() => {
      this.calculateSalePrice();
    });

    this.pretForm.get('salePercentage')?.valueChanges.subscribe(() => {
      this.calculateSalePrice();
    });
  }

  private calculateSalePrice() {
    const originalPrice = parseFloat(this.pretForm.get('originalPrice')?.value);
    const salePercentage = parseFloat(this.pretForm.get('salePercentage')?.value);

    if (!isNaN(originalPrice)) {
      if (!isNaN(salePercentage)) {
        const discountAmount = originalPrice * (salePercentage / 100);
        const salePrice = originalPrice - discountAmount;
        this.pretForm.get('salePrice')?.setValue(salePrice.toFixed(2), { emitEvent: false });
      } else {
        this.pretForm.get('salePrice')?.setValue(null, { emitEvent: false });
      }
    }
  }

  get sizesAvailable(): FormArray {
    return this.pretForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.pretForm.get('colorOptions') as FormArray;
  }

  get images(): FormArray {
    return this.pretForm.get('images') as FormArray;
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
    if (this.pretForm.invalid || this.images.length === 0) {
      this.markAllAsTouched();
      alert('Please fill all required fields and upload at least one image.');
      return;
    }

    this.isSubmitting = true;

    // Prepare the product data
    const productData = {
      ...this.pretForm.value,
      productId: crypto.randomUUID(),
      sizesAvailable: this.sizesAvailable.value.filter((size: string) => size.trim() !== ''),
      colorOptions: this.colorOptions.value.filter((color: string) => color.trim() !== '')
    };

    this.pretService.createPret(productData).subscribe({
      next: res => {
        console.log('Pret Product Submitted:', res);
        alert('Pret product uploaded successfully!');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: err => {
        console.error('Submission failed:', err);
        alert('Failed to upload pret product: ' + err.message);
        this.isSubmitting = false;
      }
    });
  }

  markAllAsTouched() {
    Object.values(this.pretForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          arrayControl.markAsTouched();
        });
      }
    });
  }

  resetForm() {
    this.pretForm.reset({
      category: 'Pret',
      averageRating: 5,
      ratingCount: 0,
      isNew: false,
      isExclusive: false,
      salePercentage: 0,
      stockQuantity: 0
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