
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../components/product/product.model';
export interface Receiving {
  id: number;
  productID: number;
  quantity: number;
  receivedDate: string; // Use string if the backend sends dates as strings
  product?: {
    product_Name: string; // Adjust this property name based on backend response
  };
}
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

    private apiUrl = 'https://localhost:7249/api/inventory';

  constructor(private http: HttpClient) { }
  getInventories(page: number, pageSize: number): Observable<{ inventories: Product[], totalItems: number }> {
    const url = `${this.apiUrl}/${page}/${pageSize}`;
    return this.http.get<{ inventories: Product[], totalItems: number }>(url);
  }
  receiveProduct(productId: number, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/receive`, { productId, quantity });
  }
  getReceivings(): Observable<Receiving[]> {
    return this.http.get<Receiving[]>(`${this.apiUrl}`);
  }
}
