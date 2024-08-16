import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../product/product.model';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Order, OrderServices } from '../../service/orders.services';
import { AuthService } from '../../service/auth.services';
import { ProductServices } from '../../service/product.services';
import { CategoryService } from '../../service/category.services';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    orderdetails : any[];
    totalorders: number;
    completedOrders: Order[] = [];
    recentSales: any[] = [];
    totalCompletedOrders: number;
    pendingOrders: number;
    maxQuantity: number ;
    totalCompletedOrderAmount: number;
    totalcustomer: number;
    totalproducts: number;
    totalcat: number;
    product: Product[] = []; 
    items!: MenuItem[];
    bestSellingProducts: any[] = [];
    products!: Product[];
    orders: any[];
    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private orderServices: OrderServices,
        private authServies: AuthService,
        private productServices: ProductServices,
        private categoryServices: CategoryService,
    ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
           // this.initChart();
        });
    }

    ngOnInit() {
        this.orderServices.getallOrders().subscribe(data => 
        {
            this.totalorders=data.length;
            const completedOrders = data.filter(order => order.orderStatus === "Completed");
            this.totalCompletedOrders=completedOrders.length;
            this.totalCompletedOrderAmount = completedOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
            this.pendingOrders = data.filter(order => order.orderStatus === "Pending").length;
            this.orders = data;
        });
        this.authServies.getalluser().subscribe(data =>{
        this.totalcustomer=data.filter(user => user.role.roleName=== "Customer_Role").length;
        });
        this.productServices.getAllProducts().subscribe(data => {
            this.totalproducts=data.length;
            this.products = data;
        });
        this.categoryServices.getCategories().subscribe(data => {
            this.totalcat=data.length;
        });
        this.orderServices.getallOrders().subscribe(orders => {
            const completedOrders = orders.filter(order => order.orderStatus === 'Completed');      
            const sortedOrders = completedOrders.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
                  const recentOrders = sortedOrders.slice(0, 8);
                  Promise.all(recentOrders.map(order => this.orderServices.getOrderDetails(order.id).toPromise()))
            .then(orderDetailsArray => {
              const allOrderDetails = orderDetailsArray.flat();
              this.recentSales = this.processOrderDetails(allOrderDetails);
              const { labels, data } = this.prepareMonthlyRevenueData(completedOrders);
              this.initChart(labels, data);

            })
            .catch(error => {
              console.error('Error fetching order details', error);
            });
        });
        this.orderServices.getdetailsofcompleted().subscribe(data => {
            this.maxQuantity = Math.max(...data.map(product => product.totalQuantity));
            this.bestSellingProducts = data;
   
         });
        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }
    processOrderDetails(orderDetails: any[]): any[] {
            const productAccumulation: { [key: number]: { name: string, price: number, totalQuantity: number } } = {};
            orderDetails.forEach(detail => {

                const productID = detail.productID; 
                if (productAccumulation[productID]) {
                    productAccumulation[productID].totalQuantity += detail.quantity;
                } else {
                    productAccumulation[productID] = {
                        name: detail.product_Name, 
                        price: detail.price,       
                        totalQuantity: detail.quantity
                    };
                }
            });
    
            const resultArray: any[] = [];
            for (const productID in productAccumulation) {
                if (productAccumulation.hasOwnProperty(productID)) {
                    const product = productAccumulation[productID];
                    resultArray.push({
                        name: product.name,
                        price: product.price, 
                        quantity: product.totalQuantity,
                    });
                }
            }
        
            return resultArray;
    }        
    prepareMonthlyRevenueData(orderDetails: any[]): { labels: string[], data: number[] } {
        const monthlyRevenue: { [key: string]: number } = {};
    
        orderDetails.forEach(detail => {
            const orderDate = new Date(detail.order_Date);
            const monthYear = `${orderDate.getMonth() + 1}-${orderDate.getFullYear()}`;
    
            if (monthlyRevenue[monthYear]) {
                monthlyRevenue[monthYear] += detail.totalAmount;
            } else {
                monthlyRevenue[monthYear] = detail.totalAmount;
            }
        });
    
        const labels = Object.keys(monthlyRevenue).sort((a, b) => {
            const [yearA, monthA] = a.split('-').map(Number);
            const [yearB, monthB] = b.split('-').map(Number);
            return yearA === yearB ? monthA - monthB : yearA - yearB;
        });
    
        const data = labels.map(label => monthlyRevenue[label]);
        return { labels, data };
    }
    initChart(labels: string[], data: number[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Monthly Revenue',
                    data: data,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                }
            ]
        };
    
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
