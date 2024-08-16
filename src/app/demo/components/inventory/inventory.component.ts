import { Component, OnInit } from '@angular/core';
import {InventoryService} from '../../service/inventory.services'

@Component({
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit{

  inventories: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalItems: number = 0;
  pageSizes: number[] = [5, 10, 20];
  pageSize: number = 7;
  constructor (private inventoryServices: InventoryService)
  {}

  ngOnInit(): void {
    this.loadInventories();
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  loadInventories(): void {
    this.inventoryServices.getInventories(this.currentPage, this.itemsPerPage).subscribe(data => {
      this.inventories = data.inventories;
      this.totalItems = data.totalItems;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadInventories();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = +target.value;
    this.currentPage = 1; 
    this.loadInventories();
  }
}
