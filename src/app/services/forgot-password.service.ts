// forgot-password.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  resetPassword(email: string, resetToken: string, newPassword: string) {
    throw new Error('Method not implemented.');
  }

}

