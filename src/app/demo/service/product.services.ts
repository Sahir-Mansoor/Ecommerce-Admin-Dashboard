// product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../components/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductServices {

    private apiUrl = 'https://localhost:7249/api/Product';

  constructor(private http: HttpClient) { }

 
  getProducts(page: number, itemsPerPage: number): Observable<{ products: Product[], totalItems: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${itemsPerPage}`;
    return this.http.get<{ products: Product[], totalItems: number }>(url);
  }
  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, product);
  }
  updateProduct(product: any): Observable<any> {
    debugger
    return this.http.put<any>(`${this.apiUrl}`,product);
  }
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }
  getproductbyid(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }
  getproductwithInventry(): Observable <any>{
    return this.http.get<any>(`${this.apiUrl}/with-inventory`)
  }
  updateInventory(productId: number, quantityChange: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update-inventory`, {
      productId,
      quantityChange
    });
  }

  confirmOrder(orderDetails: any[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/confirm-order`, orderDetails);
  }
}
