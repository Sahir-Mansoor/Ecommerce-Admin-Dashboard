import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { UserService } from '../demo/service/user.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, public userService: UserService) { }

    
    ngOnInit() {
        const role = this.userService.getRole();
        this.model = [
            {
                label: 'Home',
                items: this.getMenuItemsByRole(role)
                // items: [
                // ]
                 },
            
        ]
    }
        private getMenuItemsByRole(role: string | null):any [] {
            if (role=== 'User_Role'){
                return[
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                    {label : 'Categories',icon: 'pi pi-fw pi-list', routerLink: ['/categories']  } ,
                    {label: 'Product' ,icon: 'pi pi-fw pi-box', routerLink: ['/product']},
                    {label: 'Inventory', icon:'pi pi-fw pi-shopping-cart' , routerLink: ['/inventory']},                
                    {label: 'Receiving', icon: 'pi pi-fw pi-chart-bar',routerLink: ['/receiving']},
                    {label: 'Shop Product',icon:'pi pi-fw pi-desktop',routerLink:['/userpage']},
                    {label: 'Orders',icon:'pi pi-fw pi-table',routerLink:['/orders']},
                    {label: 'Register', icon:"pi pi-user-edit", routerLink:['/auth/register']},
                    //{label: 'View Orders' ,icon:'pi pi-fw pi-tablet', routerLink:['/cart']}

                ];
            }
            else if (role === 'Inventory_Role'){
                return [
                    {label: 'Product' ,icon: 'pi pi-fw pi-box', routerLink: ['/product']},
                    {label: 'Inventory', icon:'pi pi-fw pi-shopping-cart' , routerLink: ['/inventory']},
                    {label: 'Receiving', icon: 'pi pi-fw pi-chart-bar',routerLink: ['/receiving']},
                
                   
            ];
            }
            else if (role === 'Customer_Role'){
                return [
                    {label: 'Shop Product',icon:'pi pi-fw pi-desktop',routerLink:['/userpage']},
                    {label: 'View Orders' ,icon:'pi pi-fw pi-tablet', routerLink:['/cart']}
                ];
            }
            else if (role === 'Order_Role'){
                return [
                    {label: 'Orders',icon:'pi pi-fw pi-table',routerLink:['/orders']},
                ];
            }
            else {
                return [];
            }
        }
}
