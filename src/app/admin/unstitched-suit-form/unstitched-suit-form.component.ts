import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UnstitchedSuitService } from '../../Services/unstitched-suit.service';
import { ImageUploadService } from '../../Services/image-upload.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-unstitched-suit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './unstitched-suit-form.component.html',
  styleUrl: './unstitched-suit-form.component.css'
})
export class UnstitchedSuitFormComponent {
  suitForm: FormGroup;
  selectedFiles: File[] = [];
  imageUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private unstitchedSuitService: UnstitchedSuitService,
    private imageUploadService: ImageUploadService
  ) {
    this.suitForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Unstitched'],
      shortDescription: [''],
      originalPrice: [0.01],
      salePrice: [0.01],
      salePercentage: [0],
      sizesAvailable: this.fb.array([this.fb.control('')]),
      stockQuantity: [0],
      averageRating: [5],
      ratingCount: [0],
      colorOptions: this.fb.array([this.fb.control('')]),
      material: [''],
      isNew: [false],
      isExclusive: [false],
      shippingInfo: [''],
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

  get sizesAvailable(): FormArray {
    return this.suitForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.suitForm.get('colorOptions') as FormArray;
  }

  get images(): FormArray {
    return this.suitForm.get('images') as FormArray;
  }

  addSize() {
    this.sizesAvailable.push(this.fb.control(''));
  }

  addColor() {
    this.colorOptions.push(this.fb.control(''));
  }

  removeSize(index: number) {
    this.sizesAvailable.removeAt(index);
  }

  removeColor(index: number) {
    this.colorOptions.removeAt(index);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }

    // Preview Images
    this.imageUrls = [];
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  onSubmit() {
    if (this.suitForm.valid && this.selectedFiles.length > 0) {
      const formValue = this.suitForm.value;
      const unstitchedSuit = {
        ...formValue,
        productId: crypto.randomUUID(),
        images: []
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
          unstitchedSuit.images = imageResults;

          this.unstitchedSuitService.createUnstitchedSuit(unstitchedSuit).subscribe({
            next: res => {
              console.log('Submitted:', res);
              alert('Unstitched suit uploaded successfully!');
              this.suitForm.reset();
              this.selectedFiles = [];
              this.imageUrls = [];
            },
            error: err => {
              console.error('Submission failed:', err);
              alert('Failed to upload suit.');
            }
          });
        },
        error: err => {
          console.error('Image upload failed:', err);
          alert('Image upload failed.');
        }
      });
    } else {
      alert('Please fill all required fields and select images.');
    }
  }
}
