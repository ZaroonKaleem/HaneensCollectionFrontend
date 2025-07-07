// src/app/services/hero.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

export interface HeroSectionResponse {
  id: number;
  title: string;
  subtitle: string;
  bannerImageBase64: string;
  imageContentType: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private apiUrl = `${environment.apiUrl}/HeroSection`;

  constructor(private http: HttpClient) {}

 getHeroSection(): Observable<HeroSectionResponse> {
    return this.http.get<HeroSectionResponse>(this.apiUrl + '/latest').pipe(
      catchError(error => {
        console.error('Error fetching hero section:', error);
        return of(null as any); // Return null on error
      })
    );
  }

  updateHeroSection(formData: FormData): Observable<HeroSectionResponse> {
    return this.http.post<HeroSectionResponse>(this.apiUrl, formData).pipe(
      catchError(error => {
        console.error('Error updating hero section:', error);
        return of(null as any);
      })
    );
  }
}