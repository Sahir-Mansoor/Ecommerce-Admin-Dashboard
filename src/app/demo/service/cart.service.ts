import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: { product: any, quantity: number, orderby?: string}[] = [];

  constructor() {}

  getCart(): { product: any, quantity: number }[] {
    return this.cart;
  }

  addProduct(product: any): void {
    const item = this.cart.find(p => p.product.productID === product.productID);
    if (item) {
      item.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  removeProduct(product: any): void {
    const item = this.cart.find(p => p.product.productID === product.productID);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.cart = this.cart.filter(p => p.product.productID !== product.productID);
      }
    }
  }
  clearCart(): void {
    this.cart = [];
  }
}
