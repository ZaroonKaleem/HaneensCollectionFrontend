import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StitchedSuitService {
  private apiUrl = `${environment.apiUrl}/StitchedSuits`;

  constructor(private http: HttpClient) {}

  createStitchedSuit(suit: any): Observable<any> {
    return this.http.post(this.apiUrl, suit);
  }

  getAllStitchedSuits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getStitchedSuitById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateStitchedSuit(id: string, suit: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, suit);
  }

  deleteStitchedSuit(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
