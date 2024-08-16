import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

export interface Order {
    id: number;
    orderStatus: string;
    order_date: string;
    order_by: string;
    totalAmount: number;
    orderDetails: OrderDetail[];
}
export interface OrderDetail {
  productID: number;
  quantity: number;
}
@Injectable({
    providedIn: 'root'
})
export class OrderServices {
    private apiUrl = 'https://localhost:7249/api/Order';

    constructor(private http: HttpClient, userServices: UserService) { }

    createOrder(cartItems: any[]): Observable<any> {
        debugger
        return this.http.post<any>(`${this.apiUrl}/CreateOrder`, cartItems);
      }
    getallOrders(): Observable <Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }
    getOrderDetails(orderId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/GetOrderDetails/${orderId}`);
      }
      updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${orderId}?status=${newStatus}`, { orderId,status: newStatus });
      }
    getdetailsofcompleted() : Observable <any>{
      return this.http.get(`${this.apiUrl}/completed-details`)
    }
    getorderbyname(name : string): Observable <any>{
      debugger
      return this.http.get(`${this.apiUrl}/byname?name=${name}`);
    }

}
