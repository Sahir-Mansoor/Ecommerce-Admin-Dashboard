import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7249/api/login';
  
  constructor(private http: HttpClient, private router: Router, private userService: UserService,) { }
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.user && response.user.user && response.user.role.roleName === 'User_Role') {
          console.log("Logged In");
          this.userService.setUsername(response.user.username);
        }
      }
      )
    );
  }
  getalluser(): Observable<any>{
    return this.http.get<any >(this.apiUrl);
  }
  register(username: string, pass: string, roleid: number): Observable<any> {
    debugger
    return this.http.post<any>(`${this.apiUrl}/register?name=${username}&pass=${pass}&id=${roleid}`,{username,pass,roleid})
  }
  logout(): void {
    localStorage.removeItem('username');
  }
  getallrole(): Observable <any>{
    debugger
    return this.http.get<any>(`${this.apiUrl}/roles`);
  }
  verifyUsername(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-username?username=${username}`, { username });
  }

  resetPassword(username: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password?username=${username}&newPassword=${newPassword}`, { username, newPassword });
  }
}
