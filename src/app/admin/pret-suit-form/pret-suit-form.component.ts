import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PretService } from '../../Services/pret.service';
import { ImageUploadService } from '../../Services/image-upload.service';
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
  selectedFiles: File[] = [];
  imageUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private pretService: PretService,
    private imageUploadService: ImageUploadService
  ) {
    this.pretForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Pret'],
      shortDescription: [''],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null, [Validators.required, Validators.min(0)]],
      salePercentage: [0],
      sizesAvailable: this.fb.array([]),
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      averageRating: [5],
      ratingCount: [0],
      colorOptions: this.fb.array([]),
      material: [''],
      isNew: [false],
      isExclusive: [false],
      shippingInfo: [''],
      images: this.fb.array([]),
      note: ['']
    });

    // Initialize with one empty size and color
    this.addSize();
    this.addColor();
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

  getColorControl(index: number): FormControl {
    return this.colorOptions.at(index) as FormControl;
  }

  getSizeControl(index: number): FormControl {
    return this.sizesAvailable.at(index) as FormControl;
  }

  addSize() {
    this.sizesAvailable.push(this.fb.control('', Validators.required));
  }

  removeSize(index: number) {
    if (this.sizesAvailable.length > 1) {
      this.sizesAvailable.removeAt(index);
    }
  }

  addColor() {
    this.colorOptions.push(this.fb.control('', Validators.required));
  }

  removeColor(index: number) {
    if (this.colorOptions.length > 1) {
      this.colorOptions.removeAt(index);
    }
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    this.imageUrls = [];
    
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageUrls.push(e.target.result);
      reader.readAsDataURL(files[i]);
    }
  }

  onSubmit() {
    if (this.pretForm.valid && this.selectedFiles.length > 0) {
      // Clean up empty values from arrays
      const formValue = {
        ...this.pretForm.value,
        sizesAvailable: this.pretForm.value.sizesAvailable.filter((size: string) => size.trim() !== ''),
        colorOptions: this.pretForm.value.colorOptions.filter((color: string) => color.trim() !== ''),
        productId: crypto.randomUUID()
      };

      const uploadTasks = this.selectedFiles.map((file, index) =>
        this.imageUploadService.uploadImage(file).pipe(
          map(res => ({
            imageUrl: res.imageUrl,
            mimeType: res.mimeType,
            altText: file.name,
            isPrimary: index === 0
          }))
        )
      );

      forkJoin(uploadTasks).subscribe({
        next: imageResults => {
          const pretProduct = {
            ...formValue,
            images: imageResults
          };

          this.pretService.createPret(pretProduct).subscribe({
            next: res => {
              console.log('Pret Product Submitted:', res);
              alert('Pret product uploaded successfully!');
              this.resetForm();
            },
            error: err => {
              console.error('Submission failed:', err);
              alert('Failed to upload pret product: ' + err.message);
            }
          });
        },
        error: err => {
          console.error('Image upload failed:', err);
          alert('Image upload failed: ' + err.message);
        }
      });
    } else {
      alert('Please fill all required fields and select at least one image.');
    }
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
    
    // Add one empty size and color
    this.addSize();
    this.addColor();
    
    this.selectedFiles = [];
    this.imageUrls = [];
  }
}