import { Component, OnInit } from '@angular/core';
import { Order, OrderServices } from '../../service/orders.services';

@Component({
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit{
  Orders: any[] = [];
  statusOptions: string[] = []; // Populate with your status options
  currentPage = 1;
  isPopupVisible = false;
  filteredOrders: any[] = [];
  itemsPerPage = 5;
  totalItems = 0;
  pageSizes: number[] = [5, 10, 20];
  pageSize: number = 7;
  orderDetails: any[] = [];
  orderId: number;
  statusFilter: string = '';
  dateFilter: string = '';
  searchFilter: string = '';

  constructor ( private orderServices: OrderServices) {}

  ngOnInit(): void {
      this.fetchOrders();
      this.fetchStatusOptions();
  }
  openPopup(): void {
    this.isPopupVisible = true;
  }
  closePopup(): void {
    this.isPopupVisible = false;
  }
  viewOrderDetails(orderId: number): void {
    this.orderServices.getOrderDetails(orderId).subscribe(data =>{
      this.orderDetails=data;
    })
    this.openPopup();
  }
  fetchOrders(){
    this.orderServices.getallOrders().subscribe(data => {
      this.Orders = data;
      this.totalItems = data.length;
      this.applyFilters();
      this.updatePageData();
    }
  )
  }
  applyAllFilters(): void {
    this.applyFilters();
  }
  fetchStatusOptions(): void {
    this.statusOptions = ['Pending', 'Completed', 'Cancelled'];
  }

  applyFilters(): void {
    let filtered = [...this.Orders];

    if (this.statusFilter) {
      filtered = filtered.filter(order => order.orderStatus === this.statusFilter);
    }

    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      filtered = filtered.filter(order => new Date(order.order_Date).toDateString() === filterDate.toDateString());
    }

    if (this.searchFilter) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(this.searchFilter) ||
        order.order_By.toLowerCase().includes(this.searchFilter.toLowerCase())
      );
    }
    this.filteredOrders = filtered;
    this.totalItems = filtered.length;
    this.updatePageData();
  }
  changeOrderStatus(orderId: number, newStatus: string): void {
    this.orderServices.updateOrderStatus(orderId, newStatus).subscribe(response => {
      this.fetchOrders(); 
    });
  }
  get paginatedOrders(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
  }
  updatePageData(): void {
    const newTotalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      if (this.currentPage > newTotalPages) {
      this.currentPage = newTotalPages;
    }
    if (newTotalPages > 0 && this.currentPage === 0){
      this.currentPage=1;
    }
    // this.currentPage = newTotalPages;
    debugger
    }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePageData();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = +target.value;
    this.currentPage = 1; 
    this.updatePageData();
  }

  applyFilter(filterType: string, value: string): void {
    if (filterType === 'status') {
      this.statusFilter = value;
    } else if (filterType === 'date') {
      this.dateFilter = value;
    } else if (filterType === 'search') {
      this.searchFilter = value;
    }
    this.applyFilters();
  }
}
