import { PasswordHashingService } from './password-hashing.service';
import { AuthGuard } from './../auth.guard';
import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private users: any[] = [];
  currentuser: string = '';

  constructor(private apiservice: ApiServiceService, private router: Router, private PasswordHashingService: PasswordHashingService) {
    this.checkAuthenticationStatus();
  }


  login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.apiservice.getData().subscribe(async (data: any) => {
        this.users = data;

        const user = this.users.find((user) => user.username === username);

        if (user && await this.PasswordHashingService.verifyPassword(password, user.password)) {
          this.isAuthenticated$.next(true);
          this.setCurrentUser(username);
          resolve(true);
        } else {
          this.isAuthenticated$.next(false);
          resolve(false);
        }
      });
    });
  }

  logout(): void {
    this.isAuthenticated$.next(false);
    this.currentuser = '';
    sessionStorage.removeItem('currentuser');
    this.router.navigate(['/login']);

  }
  about(): void {
    this.isAuthenticated$.next(false);
    this.currentuser = '';
    sessionStorage.removeItem('currentuser');
    this.router.navigate(['/about']);

  }

  isAuthenticatedUser(): BehaviorSubject<boolean> {
    return this.isAuthenticated$;
  }

  setCurrentUser(username: string): void {
    this.currentuser = username;
    sessionStorage.setItem('currentuser', username);
  }

  checkAuthenticationStatus(): void {
    const username = sessionStorage.getItem('currentuser');
    if (username) {
      this.isAuthenticated$.next(true);
      this.currentuser = username;
    }
  }
}
