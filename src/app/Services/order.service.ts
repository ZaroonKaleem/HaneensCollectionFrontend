// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

// order.service.ts
createOrder(orderData: any): Observable<any> {
  // Remove the orderDto wrapper
  return this.http.post(this.apiUrl, orderData);
}

  getOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }
  
  getAllOrders(): Observable<any>{
    return this.http.get(`${this.apiUrl}`)
  }

updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
  return this.http.patch(
    `${this.apiUrl}/${orderId}/status`,
    `"${newStatus}"`, // Note the quotes for raw string
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  );
}
}