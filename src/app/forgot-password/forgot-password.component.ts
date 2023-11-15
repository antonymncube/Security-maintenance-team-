// forgot-password.component.ts
import { Component } from '@angular/core';
import { ForgotPasswordService } from './../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
submitForm() {
throw new Error('Method not implemented.');
}
resetPassword() {
throw new Error('Method not implemented.');
}
  email: string = '';
  resetToken: string = '';
  newPassword: string = '';

  constructor(private forgotPasswordService: ForgotPasswordService) {}

}



