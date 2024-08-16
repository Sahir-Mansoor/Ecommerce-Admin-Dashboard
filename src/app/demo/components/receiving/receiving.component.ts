import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../service/inventory.services';
import { ProductServices } from '../../service/product.services';
import { Product } from '../product/product.model';

interface Receiving {
  id: number;
  productID: number;
  quantity: number;
  receivedDate: string;  // or Date if you handle date conversion
}

@Component({
  templateUrl: './receiving.component.html'
})
export class ReceivingComponent implements OnInit {

  showPopup: boolean = false;
  selectedProductID: number | null = null;
  quantity: number | null = null;
  products: Product[] = [];
  receivings: Receiving[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  pageSize = 5;
  pageSizes = [5, 10, 20, 50]; // Options for page sizes

  
  constructor(private productService: ProductServices, private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchReceivings();
  }
  fetchReceivings(): void {
    debugger
    this.inventoryService.getReceivings().subscribe(data => {
      this.receivings = data;
      this.totalItems=data.length;
        });
  }
  fetchProducts(): void {
    this.productService.getAllProducts().subscribe(response => {
      this.products = response;
    });
    
  }
  onPageSizeChange(event: any): void {
    this.itemsPerPage = +event.target.value; 
    this.currentPage = 1; 
    this.updatePageData();  }
  updatePageData(): void {
    const newTotalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  
    if (this.currentPage > newTotalPages) {
      this.currentPage = newTotalPages;
    }
  
  }
  getPaginatedReceivings(): Receiving[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.receivings.slice(start, end);
  }
  get paginatedReceivings(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.receivings.slice(start, end);
  }
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

 
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  openPopup(): void {
    this.showPopup = true;
  }
  closePopup(): void {
    this.showPopup = false;
  }

  onSubmit(): void {
    if (this.selectedProductID && this.quantity) {
      this.inventoryService.receiveProduct(this.selectedProductID, this.quantity).subscribe(() => {
        this.closePopup();
        this.fetchReceivings();
      });
    }
  }
}
