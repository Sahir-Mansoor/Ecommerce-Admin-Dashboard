import { Component, OnInit} from '@angular/core';
import { CartService } from '../../service/cart.service';
import { OrderServices } from '../../service/orders.services';
import { UserService } from '../../service/user.service';

@Component({
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{

  orders : any[];
  username: string;
  orderDetails: any[] = [];
  isPopupVisible = false;
  itemsPerPage = 5;
  totalItems = 0;
  pageSizes: number[] = [5, 10, 20];
  pageSize: number = 7;
  currentPage = 1;
  filteredOrders: any[];


  constructor(
    private orderService: OrderServices,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.fetchorders();
  }

  fetchorders(){
    this.username = this.userService.getUsername();
   // this.username="Sahir Mansoor"
    this.orderService.getorderbyname(this.username).subscribe(data => {
      this.orders = data;
      this.totalItems = data.length;
    });
    debugger
    //this.updatePageData();
  }
  viewOrderDetails(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe(data =>{
      this.orderDetails=data;
    })
    this.openPopup();
  }
  openPopup(): void {
    this.isPopupVisible = true;
  }
  closePopup(): void {
    this.isPopupVisible = false;
  }
  updatePageData(): void {
    debugger
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
  get paginatedOrders(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.orders.slice(start, end);
  }
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = +target.value;
    this.currentPage = 1; // Reset to first page
    this.updatePageData();
  }

}
