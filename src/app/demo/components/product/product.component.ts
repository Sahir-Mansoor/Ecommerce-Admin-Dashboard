import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductServices } from '../../service/product.services';
import { CategoryScaleOptions } from 'chart.js';
import { CategoryService } from '../../service/category.services';
@Component({
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  products: Product[] = []; 
  productName: string = '';
  productDescription: string = '';
  price: number = 0;
  createdBy: string ='';
  isActive: boolean = false;
  selectedCategoryId: number = 0;
  categoryName: string ='';
  currentPage = 1;
  showpopup: boolean = false;
  itemsPerPage = 5; // Number of items per page
  totalItems = 0;
  pageSizes: number[] = [5, 10, 20];
  Newid: number =0;
  pageSize: number = 7;
  categories:  any[] = [];
  isEditMode: boolean = false;
  currentProduct: any = {};
  newProduct: Product = {
    id: 0,
    Product_Name: '',
    Product_Description: '',
    price: 0,
    categoryId: 0,
    createdAt: new Date().toISOString(),
    category_Name: '',
    createdBy: '',
    isActive: true
  };
  constructor(private productServices: ProductServices, private categoryServices: CategoryService) { }

  ngOnInit(): void {
    this.fetchProducts(); // Fetch products on component initialization
    this.fetchCategories();
  }
  openPopup() {
    this.showpopup = true;
  }

  closePopup(): void {
    this.showpopup = false;
   }
   
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  fetchProducts(): void {
    this.productServices.getProducts(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.products = response.products;
      this.totalItems = response.totalItems;
    });
}
fetchCategories(): void {
  this.categoryServices.getCategories().subscribe((data: any[]) => {
    this.categories = data;
  });
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.fetchProducts();
}
onPageSizeChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.itemsPerPage = +target.value;
  this.currentPage = 1; // Reset to first page
  this.fetchProducts();
}

addProduct(): void {
  debugger
  this.newProduct.Product_Name=this.productName;
  this.newProduct.Product_Description=this.productDescription;
  this.newProduct.price=this.price;
  this.newProduct.isActive=this.isActive;
  this.newProduct.createdBy=this.createdBy;
  this.newProduct.categoryId=this.convertStringToNumber(this.categoryName);
  this.productServices.addProduct(this.newProduct).subscribe(() => {
    this.closePopup(); 
    this.fetchProducts(); 
  });
}
convertStringToNumber(value: string): number {
  return +value; 
}
getCategoryID(categoryName: string): string {
  const category = this.categories.find(cat => cat.category_Name === categoryName);
  return category ? category.categoryID : '';
}
editProduct(product: any) {
  
  this.isEditMode = true;
  this.currentProduct = product;
  this.productName = product.product_Name;
  this.productDescription = product.product_Description;
  this.price = product.price;
  this.categoryName = this.getCategoryID(product.categoryName);
  this.createdBy = product.createdBy;
  this.isActive = product.isActive;
  this.showpopup = true;
}
updateProduct() {
  debugger
  const updatedProduct = {
    productID: this.currentProduct.productID,
    product_Name: this.productName,
    product_Description: this.productDescription,
    price: this.price,
    categoryID: this.categoryName,
    createdBy: this.createdBy,
    isActive: this.isActive
  };
  debugger
  this.productServices.updateProduct(updatedProduct).subscribe(() => {
    this.fetchProducts();
    this.closePopup();
  });
}
}
