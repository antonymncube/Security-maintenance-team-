import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../services/api-service.service';
import { UserFormData } from '../User';
import { Router } from '@angular/router'; //

@Component({
  selector: 'app-userupdate',
  templateUrl: './userupdate.component.html',
  styleUrls: ['./userupdate.component.scss'],
})
export class UserupdateComponent {
  userForm: FormGroup;
  user: UserFormData = new UserFormData();

  constructor(private formBuilder: FormBuilder, private apiService: ApiServiceService,private router :Router ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
      description: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      homephone: ['',[Validators.required]],  // Validate with a regular expression
      mobile: ['',[Validators.required]],  // Validate with a regular expression
      department: ['',[Validators.required]],
      agent :  ['',[Validators.required]],
    });
  }

  // Function to check if a control is invalid and should display as red
  isControlInvalid(controlName: string) {
    const control = this.userForm.get(controlName);
    console.log('back is hot')
    return control?.invalid && control?.touched;
  }
   
  // Add this function inside your UserupdateComponent class
checkPasswordMatch(): boolean {
  const passwordControl = this.userForm.get('password');
  const confirmPasswordControl = this.userForm.get('confirmpassword');

  if (passwordControl && confirmPasswordControl) {
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return false;
    }
  } else {
    alert('Password and Confirm Password controls are not available.');
    return false;
  }

  return true;
}


onSubmit() {
  if (this.userForm.valid) {
    if (this.checkPasswordMatch()) {
      // Password and Confirm Password match
      this.apiService.checkUsernameExist(this.userForm.value.username).subscribe((exists: boolean) => {
        if (exists) {
          alert('Username already exists. Please choose a different username.');
          // You can display an error message or take appropriate action here
        } else {
          // Username is unique; proceed to add the user
          this.user.email = this.userForm.value.email;
          this.user.username = this.userForm.value.username;
          this.user.password = this.userForm.value.password;
          this.user.department = this.userForm.value.department;
          this.user.mobile = this.userForm.value.mobile;
          this.user.homephone = this.userForm.value.homephone;
          this.user.description = this.userForm.value.description;
          this.user.fullname = this.userForm.value.fullname;
          this.user.agent = this.userForm.value.agent

          console.log(this.user);

          // Set other form values to the 'user' object
          this.apiService.postdata(this.user).subscribe((postResponse: any) => {
            console.log('Data posted successfully:', postResponse);
            this.router.navigate(['/home']);
            this.userForm.reset();
          });
        }
      });
    }
  }
}


}
