import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { UserFormData } from '../user';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-userupdate',
  templateUrl: './userupdate.component.html',
  styleUrls: ['./userupdate.component.scss'],
})
export class UserupdateComponent {
  userForm: FormGroup;
  user : UserFormData  = new UserFormData();

  constructor(private formBuilder: FormBuilder,private apiservice :ApiServiceService) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword:['', [Validators.required, Validators.minLength(6)]],
      description: [''],
      email: [''],
      homephone: [''],
      mobile: [''],
      department:[''],
    });
  }

 

  ngOnInit() {}

  onSubmit() {
    if (this.userForm.valid) {

      this.user.email=this.userForm.value.email
      this.user.username=this.userForm.value.username
      this.user.password=this.userForm.value.password
      this.user.department=this.userForm.value.department
      this.user.mobile=this.userForm.value.mobile
      this.user.homephone=this.userForm.value.homephone
      this.user.description=this.userForm.value.description

      this.apiservice.postdata(this.user).subscribe(response => {
        console.log('Data posted successfully:', response);
      });

      console.log(this.userForm.value);
    }
  }
  
}
