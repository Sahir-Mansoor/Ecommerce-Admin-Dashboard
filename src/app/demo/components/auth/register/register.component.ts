import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.services';
import { UserService } from 'src/app/demo/service/user.service';

@Component({
  templateUrl: './register.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
`]
})
export class RegisterComponent implements OnInit {

valCheck: string[] = ['remember'];
username: string;
password: string;
confirmPassword: string;
role: any = { id: 3, roleName: 'Customer_Role' };  // Default role as Customer_Role
showRoleDropdown: boolean = false;
roles: any[] = [];
constructor(
  public layoutService: LayoutService,
  private authService: AuthService,
  private router: Router,
  private userService: UserService
) { }

ngOnInit(): void {
  debugger
  const currentUserRole = this.userService.getRole();
        
  if (currentUserRole === 'User_Role') {
      this.showRoleDropdown = true; 
      this.displayrole();
  } else {
      this.role = { roleID: 3, roleName: 'Customer_Role' };  
  }
}

displayrole(){
  debugger
  this.authService.getallrole().subscribe(data => {
    console.log(data);
    this.roles=data;
  });
}

onRegister(): void {
  debugger
  if (this.password !== this.confirmPassword) {
    console.error("Passwords do not match");
    return;
  }
  this.authService.register(this.username,this.password,this.role.roleID).subscribe(
    response => {
      console.log(response);
      debugger
      if (response.message === "Registration successful") {
        console.log("Registered", response);
        this.router.navigate(['/auth/login']);
      }
      if (response.message === "Registration Failed: User already exists") {
        console.error("Registration Failed: User already exists");
        this.router.navigate(['/auth/error'],  {queryParams: {message: response.message}});

      }
    },
    error => {
      console.error("Registration Failed", error);
      this.router.navigate(['/auth/error'] ,{queryParams: {message: "Registration Failed: Try Again"}});

    }
  );
}
}