import { PasswordHashingService } from './../services/password-hashing.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../services/api-service.service';
import { UserFormData } from '../User';
import { Router } from '@angular/router';


@Component({
  selector: 'app-userupdate',
  templateUrl: './userupdate.component.html',
  styleUrls: ['./userupdate.component.scss'],
})
export class UserupdateComponent {
  userForm: FormGroup;
  user: UserFormData = new UserFormData();
  SecLookup : any = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiServiceService,private router :Router,
    private PasswordHashingService: PasswordHashingService ) {
       // Define a regular expression pattern to allow only letters, numbers, and underscores
    const usernamePattern = /^[A-Za-z0-9_]+$/;


    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(usernamePattern)]],
      fullname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
      description: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      homephone: ['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      mobile: ['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      department: ['',[Validators.required]],
      agent :  ['',[Validators.required]],
    });
  }

  // Function to check if a control is invalid and should display as red
  isControlInvalid(controlName: string) {
    const control = this.userForm.get(controlName);
    // console.log('back is hot')

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

ngOnInit() {
  this.getAccesslookup();
}

getAccesslookup() {
  this.apiService.getSecLookup().subscribe((SecLookup: any) => {
    this.SecLookup = SecLookup; // Assign the entire response to SecLookup
    console.log('API Response:', SecLookup);
    console.log('Security Access:', SecLookup[0].sAccessCode, 'Security Description', SecLookup[0].SAccessDescription);
    console.log("Lets see now");
  });
}





onSubmit() {
  this.getAccesslookup();
  if (this.userForm.valid) {
    if (this.checkPasswordMatch()) {

      this.PasswordHashingService.hashPassword(this.userForm.value.password).then((hashedPassword) => {

        this.apiService.checkUsernameExist(this.userForm.value.username).subscribe((exists: boolean) => {
          if (exists) {
            alert('Username already exists. Please choose a different username.');
          } else {

            this.user.email = this.userForm.value.email;
            this.user.username = this.userForm.value.username;
            this.user.password = hashedPassword;
            this.user.department = this.userForm.value.department;
            this.user.mobile = this.userForm.value.mobile;
            this.user.homephone = this.userForm.value.homephone;
            this.user.description = this.userForm.value.description;
            this.user.fullname = this.userForm.value.fullname;
            this.user.agent = this.userForm.value.agent;

            console.log(this.user);


            this.apiService.postdata(this.user).subscribe((postResponse: any) => {
              console.log('Data posted successfully:', postResponse);
              this.router.navigate(['/home']);
              this.userForm.reset();
            });
          }
        });
      });
    }
  }
}


}
