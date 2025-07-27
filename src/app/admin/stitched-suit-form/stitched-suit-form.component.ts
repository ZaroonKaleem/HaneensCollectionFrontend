// import { Component } from '@angular/core';
// import {
//   FormGroup,
//   FormBuilder,
//   FormsModule,
//   ReactiveFormsModule,
//   FormArray,
//   Validators
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { StitchedSuitService } from '../../Services/stitched-suit.service';
// import { ImageUploadService } from '../../Services/image-upload.service';
// import { forkJoin, map } from 'rxjs';

// @Component({
//   selector: 'app-stitched-suit-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './stitched-suit-form.component.html',
//   styleUrls: ['./stitched-suit-form.component.css']
// })
// export class StitchedSuitFormComponent {
//   suitForm: FormGroup;
//   selectedFiles: File[] = [];
//   imageUrls: string[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private stitchedSuitService: StitchedSuitService,
//     private imageUploadService: ImageUploadService
//   ) {
//     this.suitForm = this.fb.group({
//       name: ['', Validators.required],
//       category: ['Stitched'],
//       categoryType: ['', Validators.required], // Dropdown: 1-piece, 2-piece, 3-piece
//       shortDescription: [''],
//       originalPrice: [null, Validators.required],
//       salePrice: [null, Validators.required],
//       salePercentage: [null],
//       sizesAvailable: this.fb.array([this.fb.control('')]),
//       stockQuantity: [null],
//       averageRating: [5],
//       ratingCount: [0],
//       colorOptions: this.fb.array([this.fb.control('')]),
//       material: [''],
//       isNew: [false],
//       isExclusive: [false],
//       shippingInfo: [''],
//       images: this.fb.array([]),
//       shirt: this.fb.group({
//         embroideredNeckline: [''],
//         digitalPrint: [''],
//         embroideredBorder: [''],
//         fabric: [''],
//         color: ['']
//       }),
//       dupatta: this.fb.group({
//         digitalPrint: [''],
//         fabric: [''],
//         color: ['']
//       }),
//       trouser: this.fb.group({
//         description: [''],
//         fabric: [''],
//         color: ['']
//       }),
//       note: ['']
//     });
//   }

//   get sizesAvailable(): FormArray {
//     return this.suitForm.get('sizesAvailable') as FormArray;
//   }

//   get colorOptions(): FormArray {
//     return this.suitForm.get('colorOptions') as FormArray;
//   }

//   get images(): FormArray {
//     return this.suitForm.get('images') as FormArray;
//   }

//   addSize() {
//     this.sizesAvailable.push(this.fb.control(''));
//   }

//   addColor() {
//     this.colorOptions.push(this.fb.control(''));
//   }

//   removeSize(index: number) {
//     this.sizesAvailable.removeAt(index);
//   }

//   removeColor(index: number) {
//     this.colorOptions.removeAt(index);
//   }

//   onFileChange(event: any) {
//     const files: FileList = event.target.files;
//     for (let i = 0; i < files.length; i++) {
//       this.selectedFiles.push(files[i]);
//     }

//     // Preview Images
//     this.imageUrls = [];
//     this.selectedFiles.forEach(file => {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.imageUrls.push(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     });
//   }

//   onSubmit() {
//     if (this.suitForm.valid && this.selectedFiles.length > 0) {
//       const formValue = this.suitForm.value;
//       const stitchedSuit = {
//         ...formValue,
//         productId: crypto.randomUUID(),
//         images: []
//       };

//       const uploadTasks = this.selectedFiles.map((file, index) =>
//         this.imageUploadService.uploadImage(file).pipe(
//           map(res => ({
//             imageUrl: res.imageUrl,
//             mimeType: res.mimeType,
//             altText: file.name,
//             isPrimary: index === 0
//           }))
//         )
//       );

//       forkJoin(uploadTasks).subscribe({
//         next: imageResults => {
//           stitchedSuit.images = imageResults;

//           this.stitchedSuitService.createStitchedSuit(stitchedSuit).subscribe({
//             next: res => {
//               console.log('Stitched Suit Submitted:', res);
//               alert('Stitched Suit uploaded successfully!');
//               this.suitForm.reset();
//               this.selectedFiles = [];
//               this.imageUrls = [];
//             },
//             error: err => {
//               console.error('Submission failed:', err);
//               alert('Failed to upload stitched suit.');
//             }
//           });
//         },
//         error: err => {
//           console.error('Image upload failed:', err);
//           alert('Image upload failed.');
//         }
//       });
//     } else {
//       alert('Please fill all required fields and select images.');
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StitchedSuitService } from '../../Services/stitched-suit.service';
import { ImageUploadService } from '../../Services/image-upload.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-stitched-suit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stitched-suit-form.component.html',
  styleUrls: ['./stitched-suit-form.component.css']
})
export class StitchedSuitFormComponent implements OnInit {
  suitForm: FormGroup;
  selectedFiles: File[] = [];
  imageUrls: string[] = [];
  stitchedSuits: any[] = [];
  showModal = false;
  editMode = false;
  currentProductId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private stitchedSuitService: StitchedSuitService,
    private imageUploadService: ImageUploadService
  ) {
    this.suitForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Stitched'],
      categoryType: ['', Validators.required],
      shortDescription: [''],
      originalPrice: [null, Validators.required],
      salePrice: [null, Validators.required],
      salePercentage: [null],
      sizesAvailable: this.fb.array([this.fb.control('')]),
      stockQuantity: [null],
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

  ngOnInit() {
    this.loadStitchedSuits();
  }

  get sizesAvailable(): FormArray {
    return this.suitForm.get('sizesAvailable') as FormArray;
  }

  get colorOptions(): FormArray {
    return this.suitForm.get('colorOptions') as FormArray;
  }

  openAddModal() {
    this.editMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(suit: any) {
    this.editMode = true;
    this.currentProductId = suit.productId;
    this.suitForm.patchValue(suit);
    this.imageUrls = suit.images?.map((img: any) => img.imageUrl) || [];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  loadStitchedSuits() {
    this.stitchedSuitService.getAllStitchedSuits().subscribe({
      next: (res: any) => (this.stitchedSuits = res || []),
      error: (err: any) => console.error('Failed to load suits:', err)
    });
  }

  viewSuit(suit: any) {
    alert(`Viewing suit: ${suit.name}`);
  }

  deleteSuit(productId: string) {
    if (confirm('Are you sure you want to delete this suit?')) {
      this.stitchedSuitService.deleteStitchedSuit(productId).subscribe({
        next: () => {
          this.stitchedSuits = this.stitchedSuits.filter(s => s.productId !== productId);
          alert('Suit deleted successfully.');
        },
        error: (err: any) => console.error('Delete failed:', err)
      });
    }
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
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }

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
    if (!this.suitForm.valid) {
      alert('Please fill all required fields and select images.');
      return;
    }

    const formValue = this.suitForm.value;
    const stitchedSuit = {
      ...formValue,
      productId: this.editMode ? this.currentProductId : crypto.randomUUID(),
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
        stitchedSuit.images = imageResults;
        if (this.editMode && this.currentProductId) {
          this.stitchedSuitService.updateStitchedSuit(this.currentProductId, stitchedSuit).subscribe({
            next: () => {
              alert('Stitched Suit updated successfully!');
              this.loadStitchedSuits();
              this.closeModal();
            },
            error: () => alert('Failed to update stitched suit.')
          });
        } else {
          this.stitchedSuitService.createStitchedSuit(stitchedSuit).subscribe({
            next: () => {
              alert('Stitched Suit uploaded successfully!');
              this.loadStitchedSuits();
              this.closeModal();
            },
            error: () => alert('Failed to upload stitched suit.')
          });
        }
      },
      error: () => alert('Image upload failed.')
    });
  }

  resetForm() {
    this.suitForm.reset();
    this.editMode = false;
    this.selectedFiles = [];
    this.imageUrls = [];
    this.currentProductId = null;
  }
}
