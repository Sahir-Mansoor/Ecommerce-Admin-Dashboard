import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.services';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent {

    username: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  usernameVerified: boolean = false;

  constructor (
    private authService: AuthService,
    private router: Router
  ){}
  verifyUsername() {
    debugger
    this.authService.verifyUsername(this.username).subscribe(response => {
      if (response.success) {
        this.usernameVerified = true;
      } 
      else{
        this.router.navigate(['/auth/error'], {queryParams: {message: "Username Not Found"}});
      }
    });
  }
  resetPassword() {
    debugger
    if (this.newPassword !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    this.authService.resetPassword(this.username, this.newPassword).subscribe(response => {
      if (response.success) {
        console.log('Password reset successful');
        this.router.navigate(['/auth/login']);
      } else {
        console.error('Password reset failed');
      }
    });
  }

}
