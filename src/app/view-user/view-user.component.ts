import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';


@Component({

  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  id: string = '';
  userForm: FormGroup;
  currentuser : string = ''
  fullname : string ='';
  selectedProducts: string[] = [];
  UserAccescodes : any ;
  allAccessCodes : any;
  matchingAccessCodes : any ;
  userAccessGroups : any ;
  superUserExist : any ;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private route: ActivatedRoute,
    private router :Router
  ) {
    this.userForm = this.formBuilder.group({
      id: [''],
      username: [{ value: '', disabled: true }],
      fullname: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]],
      department: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      discription: [{ value: '', disabled: true }],
      homephone: [{ value: '', disabled: true }],
      mobile: [{ value: '', disabled: true }],
      agent: [{ value: '', disabled: true }],
      language: [{ value: '', disabled: true }]
    });
  }

  navigatehome(){
    this.router.navigate(['./home'])
  }

  ngOnInit() {
    const storedUser = sessionStorage.getItem('currentuser');
    this.currentuser = storedUser !== null ? storedUser : '';
  
    this.route.params.subscribe((params: { [x: string]: string }) => {
      this.id = params['id'];
  
      this.apiService.getUserDetails(this.id).subscribe((userDetails: any) => {
        console.log('User Details:', userDetails);
        this.fullname = userDetails.fullname;
        this.userForm.patchValue(userDetails);
        this.selectedProducts = userDetails.selectedProducts;
      });
  
      this.apiService.getUserAccessGroups(this.id).subscribe((data) => {
        this.userAccessGroups = data.AccessGroups;
        console.log("User access groups ", this.userAccessGroups);
      });
  
      this.apiService.getSecLookup().subscribe((res: any) => {
        this.allAccessCodes = res;
  
        this.apiService.getUserAccessCodes(this.id).subscribe((res1: any) => {
          const userAccessCodes = res1.accesscodes;
          this.UserAccescodes = userAccessCodes;
  
          this.matchingAccessCodes = this.allAccessCodes
            .filter((codeObj: { sAccessCode: any; }) => userAccessCodes.includes(codeObj.sAccessCode));
  
          
          this.superUserExist = this.checksuperuser();
        });
      });
    });
  }
  
  checksuperuser(): boolean {
    // console.log( this.UserAccescodes);
    return this.UserAccescodes.includes('SU01');
  }
}  


