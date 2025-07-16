// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { environment } from '../environments/environment';

// export interface ProductImageDto {
//   base64Image: string;
//   altText: string;
//   isPrimary: boolean;
//   mimeType: string;
// }

// export interface FeaturedProductDto {
//   productId: string;
//   name: string;
//   category: string;
//   shortDescription: string;
//   originalPrice: number;
//   salePrice?: number;
//   salePercentage?: number;
//   sizesAvailable: string[];
//   stockQuantity: number;
//   averageRating?: number;
//   ratingCount: number;
//   colorOptions: string[];
//   material: string;
//   isNew: boolean;
//   isExclusive: boolean;
//   shippingInfo: string;
//   images: ProductImageDto[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class FeaturedProductsService {
//   private apiUrl = `${environment.apiUrl}/FeaturedProducts`;

//   constructor(private http: HttpClient) {}

//   getFeaturedProducts(): Observable<FeaturedProductDto[]> {
//     return this.http.get<FeaturedProductDto[]>(this.apiUrl).pipe(
//       catchError(this.handleError)
//     );
//   }

//   createFeaturedProduct(product: FeaturedProductDto): Observable<FeaturedProductDto> {
//     return this.http.post<FeaturedProductDto>(this.apiUrl, product).pipe(
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'An error occurred';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Error: ${error.error.message}`;
//     } else {
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//       if (error.error && error.error.errors) {
//         errorMessage += '\nDetails: ' + JSON.stringify(error.error.errors);
//       }
//     }
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface ProductImageDto {
  imageId: string;
  imageUrl: string;  // Change from base64Image to imageUrl
  altText: string;
  isPrimary: boolean;
  mimeType: string;
}

export interface FeaturedProductDto {
  productId: string;
  name: string;
  category: string;
  shortDescription: string;
  originalPrice: number;
  salePrice?: number;
  salePercentage?: number;
  sizesAvailable: string[];
  stockQuantity: number;
  averageRating?: number;
  ratingCount: number;
  colorOptions: string[];
  material: string;
  isNew: boolean;
  isExclusive: boolean;
  shippingInfo: string;
  images: ProductImageDto[];
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedProductsService {
  private apiUrl = `${environment.apiUrl}/FeaturedProducts`; // Ensure correct endpoint

  constructor(private http: HttpClient) {}

    getFeaturedProducts(): Observable<FeaturedProductDto[]> {
    return this.http.get<FeaturedProductDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
    }
  
   createFeaturedProduct(product: FeaturedProductDto): Observable<FeaturedProductDto> {
    return this.http.post<FeaturedProductDto>(this.apiUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  // featured-products.service.ts
getProductById(productId: string): Observable<FeaturedProductDto> {
  // Implement your API call to fetch a single product
  // This is just an example - adjust to your actual API
  return this.http.get<FeaturedProductDto>(`${this.apiUrl}/${productId}`);
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.errors) {
        const validationErrors = Object.entries(error.error.errors)
          .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
          .join('; ');
        errorMessage += `\nValidation Errors: ${validationErrors}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}