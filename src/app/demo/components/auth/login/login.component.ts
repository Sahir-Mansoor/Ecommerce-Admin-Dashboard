import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/demo/service/auth.services';
import { UserService } from 'src/app/demo/service/user.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    email!: string;
    password!: string;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {
     }
     onLogin(): void 
     {
        this.authService.login(this.email,this.password).subscribe(
          response => {
            console.log(response);
            if (response.message==="Login successful"){
              console.log("Logged In", response);
              this.userService.setUsername(response.user.username);
              this.userService.setRole(response.user.role.roleName);
              if (response.user.role.roleName === "Customer_Role"){
                this.router.navigate(['/userpage']);
              }
              else {
                this.router.navigate(['/dashboard']);
              }
            }
            if (response.message==="Invalid username or password"){
                this.router.navigate(['/auth/error'], {queryParams: {message: response.message}});
            }
            
            
          },
          error => {
            console.error("Login Failed",error);
          }
        );
     }
  }
  
