import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Import your AuthService with the correct capitalization

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
       console.log(`the user userna ${username} and password ${password}`)
      if (this.authService.login(username, password)) { 
        this.router.navigate(['/home']);
      } else {
        
        alert('Invalid username or password');
      }
    } else {
      alert('Please fill in both username and password fields.');
    }
  }
}
