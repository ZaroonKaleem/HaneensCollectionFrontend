import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllSuitsService {
  private apiUrl = `${environment.apiUrl}/AllSuits`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch all suits (stitched + unstitched)
   */
  getAllSuits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  /**
   * Fetch a single suit by ID (if needed)
   */
  getSuitById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
