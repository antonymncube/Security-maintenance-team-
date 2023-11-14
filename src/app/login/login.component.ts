import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      try {
        await this.authService.login(username, password);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Login error:', error);

        if (error === 'InvalidUsername ') {
          this.errorMessage = 'Invalid username';
        } else if (error === 'InvalidPassword') {
          this.errorMessage = 'Invalid password';
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      }
    } else {
      this.errorMessage = 'Please fill in both username and password fields.';
    }
  }
}
