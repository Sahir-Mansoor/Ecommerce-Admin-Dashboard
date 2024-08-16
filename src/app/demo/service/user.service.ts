import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private username: string | null = null;
  private role: string | null = null;
  private roleName: string;
  constructor() { }

  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string | null {
    return this.username;
  }
  setRole(role: string): void {
    this.role = role;
  }
  getRole(): string | null {
    return this.role;
  }
  logout(): void {
    debugger
    this.username = null;
    this.role=null;
  }
}
