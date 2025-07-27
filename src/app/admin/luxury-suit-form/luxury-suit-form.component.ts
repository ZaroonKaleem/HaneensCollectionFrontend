import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LuxuryService } from '../../Services/luxury.service';
import { ImageUploadService } from '../../Services/image-upload.service';
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
  selectedFiles: File[] = [];
  imageUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private luxuryService: LuxuryService,
    private imageUploadService: ImageUploadService
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
      sizesAvailable: this.fb.array([]),
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      colorOptions: this.fb.array([]),
      material: ['', Validators.required],
      originCountry: [''],
      isLimitedEdition: [false],
      isNew: [false],
      isExclusive: [false],
      hasCertificate: [false],
      shippingInfo: [''],
      craftsmanshipDetails: [''],
      images: this.fb.array([]),
      note: ['']
    });

    this.addSize();
    this.addColor();
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
    if (this.luxuryForm.valid && this.selectedFiles.length > 0) {
      const formValue = {
        ...this.luxuryForm.value,
        sizesAvailable: this.luxuryForm.value.sizesAvailable.filter((size: string) => size.trim() !== ''),
        colorOptions: this.luxuryForm.value.colorOptions.filter((color: string) => color.trim() !== ''),
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
        next: (imageResults) => {
          const luxuryProduct = {
            ...formValue,
            images: imageResults
          };

          this.luxuryService.createLuxury(luxuryProduct).subscribe({
            next: (res) => {
              console.log('Luxury Product Submitted:', res);
              alert('Luxury product uploaded successfully!');
              this.resetForm();
            },
            error: (err) => {
              console.error('Submission failed:', err);
              alert('Failed to upload luxury product: ' + err.message);
            }
          });
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          alert('Image upload failed: ' + err.message);
        }
      });
    } else {
      alert('Please fill all required fields and select at least one image.');
    }
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
    
    while (this.sizesAvailable.length) {
      this.sizesAvailable.removeAt(0);
    }
    while (this.colorOptions.length) {
      this.colorOptions.removeAt(0);
    }
    
    this.addSize();
    this.addColor();
    this.selectedFiles = [];
    this.imageUrls = [];
  }
}