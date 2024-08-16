import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { UserService } from '../demo/service/user.service';
import { Router } from '@angular/router';
import { dE } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, public userService: UserService, 
        private router: Router
    ) { }
getUsername(): string {
    return this.userService.getUsername();
  }
  logout(): void {
    debugger
    this.userService.logout();

    this.router.navigate(['/auth/login']);
}
login(): void {
    this.router.navigate(['/auth/login']);
}
isUserLoggedIn(): boolean {
    const username = this.userService.getUsername();
    return username !== null && username.trim() !== '';
}
onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
}
}