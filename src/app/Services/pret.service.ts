import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PretService {
  private baseUrl = `${environment.apiUrl}/pret`; // Adjust API endpoint if needed

  constructor(private http: HttpClient) {}

  // Get all pret products
  getAllPret(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Get a pret product by ID
  getPretById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Create a new pret product
  createPret(pret: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, pret);
  }

  // Update an existing pret product
  updatePret(id: string, pret: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, pret);
  }

  // Delete a pret product
  deletePret(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
