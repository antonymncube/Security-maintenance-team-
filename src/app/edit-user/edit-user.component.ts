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
  editedFields: Set<string> = new Set(); // Track edited fields


  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      id: [''],
      username: [{ value: '',  }, Validators.required], // Set username as not editable
      fullname: ['', Validators.required],
      description: [''],
      password: [{ value: '', }, [Validators.required, Validators.minLength(6)]], // Set password as not editable
      department: [''],
      email: ['', [Validators.required, Validators.email]],
      homephone: ['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      mobile: ['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      agent :  ['',[Validators.required]],
      lastUpdated: [''],
      Language:['']
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
      const lastUpdatedControl = this.userForm.get('lastUpdated');

      if (lastUpdatedControl) {
        lastUpdatedControl.setValue(new Date());
      }

      this.apiService.updateUser(this.id, this.userForm.value).subscribe((response: any) => {
        this.userForm.reset();
        this.router.navigate(['/home']);
        console.log('User data updated:', response);
      });
    }
  }

}
