import { Component, DebugElement, OnInit } from '@angular/core';
import { Product as OriginalProduct } from '../product/product.model'; // adjust the path as necessary
import { ProductServices } from '../../service/product.services';
import { CartService } from '../../service/cart.service';
import { OrderServices } from '../../service/orders.services';
import { UserService } from '../../service/user.service';
import { Category, CategoryService } from '../../service/category.services';
import { Router } from '@angular/router';

export interface CartItem {
  product: Product; // Full product details
  quantity: number; // Quantity of the product
  orderby: string;
}
interface Product extends OriginalProduct {
  quantity: number;
  orderby: string;
}
@Component({
  templateUrl: './userpage.component.html',
})
export class UserpageComponent implements OnInit {
  products: Product[] = [];
  cartItems: { product: any, quantity: number, orderby?: string, 
  }[] = [];
  totalItems: number = 0;
  totalAmount: number = 0;
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  statusFilter: string = ''
  statusOptions: string[] = [];
  selectedCategory: string;
  orderId: number = 0;
  hoveredProduct: any = null;
  showMore: boolean = false;
  currentPage = 0;
  totalpages: number;
  itemsPerPage = 5;
  visibleCategories: Category[];
  constructor (
    private productServices: ProductServices, 
    private orderServices: OrderServices,
    private cartService: CartService,
    private userServices: UserService,
    private categoryService: CategoryService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.updateCart();
    this.fetchCategories();
  }
  Clear(){
    this.cartService.clearCart();
    this.fetchProducts();
  }
  fetchProducts(): void {
    this.productServices.getproductwithInventry().subscribe((data: any[]) => {
      this.products = data;
      this.filteredProducts=data;
    });
    this.updateCart();
    }
  addToCart(product: any): void {
    this.cartService.addProduct(product);
    this.updateCart();
  }
  removeFromCart(product: any): void {
    this.cartService.removeProduct(product);
    this.updateCart();
  }
  updateCart(): void {
    this.cartItems = this.cartService.getCart();
    this.calculateTotalAmount();
  }

  isProductInCart(product: any): boolean {
    return this.cartItems.some(item => item.product.ProductID === product.ProductID);
  }
  calculateTotalItems(): number {
    return this.cartItems.length;
 }
 calculateTotalAmount(): void {
  this.totalAmount = this.cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);  }, 0);
}
    Confirm(): void {
  const username = this.userServices.getUsername();
  if (!username || username.trim() === '') {
      this.showLoginMessage();
  }
  else {
  const cartItemsWithOrderby = this.cartItems.map(item => ({
    ...item,
    orderby: username
  }));

  this.orderServices.createOrder(cartItemsWithOrderby).subscribe(
    response => {
      console.log(response);
      this.orderId = response;
    },
    error => {
      console.error('Error creating order', error);
    }
  );
}
    }
    showLoginMessage(): void {
      alert("You should log in to confirm the order.");
      this.router.navigate(['/auth/login']);
  }
fetchCategories(): void {
  this.categoryService.getCategories().subscribe(data => {
    this.categories = data;
    this.categories=this.categories.filter(category => category.isActive);
  this.totalpages = Math.ceil(this.categories.length / this.itemsPerPage);
  this.visibleCategories = this.getPageCategories(this.currentPage);
   this.selectCategory('All'); 
   this.applyFilters();
  });
}
  Ok(): void{
    this.orderId = null;
    this.cartService.clearCart();
    this.fetchProducts();
  }
  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.applyFilters();
  }
applyFilters(): void {
  if (this.selectedCategory === "All") { 
    this.filteredProducts = this.products;
  } else {
    this.filteredProducts = this.products.filter(p => p.category_Name === this.selectedCategory);
  }
}
onHover(product: any): void {
  this.hoveredProduct = product;
}

onLeave(): void {
  this.hoveredProduct = null;
}
getPageCategories(page: number) {
  const startIndex = page * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  
  // Paginate without including the "All" category
  if (page === 0) {
    return this.categories.slice(0, this.itemsPerPage);
  } else {
    return this.categories.slice(startIndex, endIndex);
  }
}

nextPage() {
  if (this.currentPage < this.totalpages - 1) {
    this.currentPage++;
    this.visibleCategories = this.getPageCategories(this.currentPage);
  }
}

previousPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.visibleCategories = this.getPageCategories(this.currentPage);
  }
}
}

