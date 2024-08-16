import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { roleGuard } from './guards/role.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', redirectTo: 'userpage', pathMatch: 'full' 
            },
            // {
            //     path: '', redirectTo: 'dashborad', pathMatch: 'full' 
            // },
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'dashboard', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [roleGuard], data: { roles: ['User_Role' , 'Inventory_Role', 'Order_Role'] } },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) ,canActivate: [roleGuard], data: { roles: ['User_Role' , 'Inventory_Role', 'Order_Role'] } },
                    { path: 'categories', loadChildren: ()=> import('./demo/components/categories/categories.module').then(m=>m.CategoriesModule), canActivate: [roleGuard], data: { roles: ['User_Role' , 'Inventory_Role'] } },
                    { path: 'product', loadChildren: ()=> import('./demo/components/product/product.module').then(m=>m.ProductModule), canActivate: [roleGuard], data: { roles: ['User_Role' , 'Inventory_Role'] } },
                    { path: 'inventory', loadChildren: ()=> import('./demo/components/inventory/inventory.module').then(m=>m.InventoryModule), canActivate: [roleGuard], data: { roles: ['User_Role' , 'Inventory_Role'] } },
                    { path: 'receiving', loadChildren: ()=> import('./demo/components/receiving/receiving.module').then(m=>m.ReceivingModule), canActivate: [roleGuard], data: { roles: ['User_Role' , 'Inventory_Role'] } },
                    { path: 'userpage', loadChildren: ()=> import('./demo/components/userpage//userpage.module').then(m=>m.UserpageModule)},
                    { path: 'orders', loadChildren: ()=> import('./demo/components/orders/orders.module').then(m=> m.OrdersModule), canActivate: [roleGuard], data: { roles: ['User_Role' , 'Order_Role'] } },
                    { path: 'cart', loadChildren: ()=> import('./demo/components/cart//cart.module').then(m=>m.CartModule), canActivate: [roleGuard], data: { roles: ['Customer_Role'] } },
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
