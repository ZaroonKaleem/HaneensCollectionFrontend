import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LuxuryService {
  private baseUrl = `${environment.apiUrl}/luxury`; // Different endpoint for luxury

  constructor(private http: HttpClient) {}

  // Get all luxury products
  getAllLuxury(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Get a luxury product by ID
  getLuxuryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Create a new luxury product
  createLuxury(luxury: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, luxury);
  }

  // Update an existing luxury product
  updateLuxury(id: string, luxury: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, luxury);
  }

  // Delete a luxury product
  deleteLuxury(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}