import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnstitchedSuitService {
  private apiUrl = `${environment.apiUrl}/UnstitchedSuits`; 
  
constructor(private http: HttpClient) {}

  createUnstitchedSuit(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAllUnstitchedSuits(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}
}
