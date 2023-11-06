import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  id: string = '';
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      id: [''],
      username: ['', Validators.required],
      fullname: ['', Validators.required],
      description: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      department: [''],
      email: ['', [Validators.required, Validators.email]],
      homephone: ['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      mobile: ['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      agent :  ['',[Validators.required]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.id = params['id'];
      console.log(this.id);

      this.apiService.getUserDetails(this.id).subscribe((userDetails: any) => {
        this.userForm.patchValue(userDetails);
      });
    });
  }

  isControlInvalid(controlName: string) {
    const control = this.userForm.get(controlName);
  
    return control?.invalid && control?.touched;
  }
   

  onSubmit() {
    if (this.userForm.valid) {
      this.apiService.updateUser(this.id, this.userForm.value).subscribe((response: any) => {
        this.userForm.reset();
        this.router.navigate(['/home']);
        console.log('User data updated:', response);
      });
    }
  }
}
