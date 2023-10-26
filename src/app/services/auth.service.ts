import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private users: any[] = [];
  currentuser : string= ''

  constructor(private apiservice: ApiServiceService,private router : Router) {}

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
    this.router.navigate(['/login']); // Navigate to the login page's route
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
  setCurrentUser(username: string): void {
    this.currentuser = username;
    sessionStorage.setItem('currentuser', username)
  }
  
}


