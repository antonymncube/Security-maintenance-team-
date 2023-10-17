import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class authGuard implements CanActivate {  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(`it is tru brother lets check other things  ${this.authService.isAuthenticatedUser()}`)
    if (this.authService.isAuthenticatedUser()) {
      console.log(`it is tru brother lets check other things  ${this.authService.isAuthenticatedUser()}`)
      return true;
    } else {
      this.router.navigate(['/login']);
      console.log(`it is not working brother check it  ${this.authService.isAuthenticatedUser()}`)
      return false;
    }
  }
}
