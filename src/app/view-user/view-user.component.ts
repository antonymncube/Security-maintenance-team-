import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  id: string = '';
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.formBuilder.group({
      id: [''],
      username: [{ value: '', disabled: true }],
      fullname: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]],
      department: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      homephone: [{ value: '', disabled: true }],
      mobile: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: { [x: string]: string }) => {
      this.id = params['id'];
      console.log(this.id);

      this.apiService.getUserDetails(this.id).subscribe((userDetails: any) => {
        this.userForm.patchValue(userDetails);
      });
    });
  }
}
