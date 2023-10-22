import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private users: any[] = [];
  currentuser : string= ''

  constructor(private apiservice: ApiServiceService) {}

  login(username: string, password: string): boolean {
 
    this.apiservice.getData().subscribe((data: any) => {
      this.users = data;
      console.log(username)
       
      const authenticatedUser = this.users.find(user =>  user.username === username && user.password === password);

      if (authenticatedUser) {
        this.isAuthenticated = true;
      }
    });

    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
  setCurrentUser(username: string): void {
    this.currentuser = username;
    sessionStorage.setItem('currentuser', username)
  }
  
}


