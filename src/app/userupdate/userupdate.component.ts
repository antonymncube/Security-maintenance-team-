import { PasswordHashingService } from './../services/password-hashing.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../services/api-service.service';
import { UserFormData } from '../User';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';





@Component({
  selector: 'app-userupdate',
  templateUrl: './userupdate.component.html',
  styleUrls: ['./userupdate.component.scss'],
})
export class UserupdateComponent {
  userForm: FormGroup;
  filterTextControl1 = new FormControl('');
  filterTextControl2 = new FormControl('');
  user: UserFormData = new UserFormData();
  SecLookup: any = '';
  selectedAccessCodes: any[] = [];
  selectedProducts: string[] = [];
  AvailableCodes: any[] = [];
  selectedAccessGroups: any;
  generatedId: string = '';
  solvingarray: any[] = []
  filterTextChanged = new Subject<string>();
  searchTerm: string = '';
  

  dataToUpdate: any

  accessGroup: Array<{
    clicked: boolean;
    sAccessGroup: string;
    sAccessCodes: Array<string>;
    selected: boolean;
    id: string
  }>;

  accessCodes: Array<{
    sAccessCode: {
      code: string;
      status: boolean;
    };
    SAccessDescription: string;
    selected: boolean;

  }>;
  selectedGroupId: string = '';
  accessGroundForm: any;
  selectedGroupIndex: number | null = null;
  filterText: string = '';
  
   
  

  constructor(private formBuilder: FormBuilder, private apiService: ApiServiceService, private router: Router,
    private PasswordHashingService: PasswordHashingService) {
    this.accessCodes = [];
    this.accessGroup = [];
    this.filterTextControl1.valueChanges.pipe(

    ).subscribe(() => {
      this.filteredAccessCodes();
    });
    this.filterTextControl2.valueChanges.pipe(

      ).subscribe(() => {
        this.filteredAccessGroups();
      });
    apiService.getAccessGroup().subscribe(res => {
      this.accessGroup = res;
      // console.log("here are the groups" + this.accessGroup)
    })
    apiService.getSecLookup().subscribe((res: any) => {
      this.accessCodes = res; // Assigning all the access codes to this array
      // console.log("here is respond mnaka", res);
      
    });

     

  
    // this.accessCodes = data;
    this.accesscodes();

    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required,]],
      fullname: ['',],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', ],
      email: ['', [Validators.required, Validators.email]],
      homephone: ['', [Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      mobile: ['', [Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      department: ['', [Validators.required]],
      agent: ['', [Validators.required]],
      language: ['',],
      filterText1: this.filterTextControl1,
      filterText2:this.filterTextControl2
    });
  }


  
  generateFourDigitId(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    this.generatedId = randomNumber.toString();
    return randomNumber.toString();
  }



  accesscodes() {
    this.apiService.getSecLookup().subscribe((data) => {
      this.accessCodes = data;
    });
  }
  // Function to check if a control is invalid and should display as red
  isControlInvalid(controlName: string) {
    const control = this.userForm.get(controlName);
    // console.log('back is hot')

    return control?.invalid && (control?.touched || control?.dirty);
  }

  getSelectedAccessCodes(): void {
    this.selectedAccessCodes = this.accessCodes.filter((code) => code.selected);

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

    
      this.filterTextControl2.valueChanges.pipe(
        debounceTime(300) // Adjust the debounce time as needed
      ).subscribe(() => {
        this.filteredAccessGroups();
      });
    

    // Subscribe to changes in filterText2 control
    this.filterTextControl2.valueChanges.subscribe((filterText) => {
      // return this.filteredAccessGroup(filterText);
    });
  }

 

  getAccesslookup() {
    this.apiService.getSecLookup().subscribe((SecLookup: any) => {
      this.SecLookup = SecLookup; // Assign the entire response to SecLookup

    });

    // this.filteredAccessGroup();
  }


  receiveSelectedProducts(products: string[]) {
    console.log('Received selected products:', products);
    // this.selectedProducts = products;
    this.selectedProducts = products;

  }

  updateUserWithSelectedProducts() {
    this.user.selectedProducts = this.selectedProducts;

  }


  onSubmit() {
    this.getAccesslookup();
    if (this.userForm.valid) {
      if (this.checkPasswordMatch()) {
        this.PasswordHashingService.hashPassword(this.userForm.value.password).then((hashedPassword) => {
          this.apiService.checkUsernameExisttt(this.userForm.value.username).subscribe((exists: boolean) => {
            if (exists) {
              alert('Username already exists. Please choose a different username.');
            } else {
            this.generateFourDigitId();
            this.user.email = this.userForm.value.email;
            this.user.username = this.userForm.value.username.toLowerCase();
            this.user.password = hashedPassword;
            this.user.department = this.userForm.value.department;
            this.user.mobile = this.userForm.value.mobile;
            this.user.homephone = this.userForm.value.homephone;
            this.user.description = this.userForm.value.description;
            this.user.fullname = this.userForm.value.fullname;
            this.user.agent = this.userForm.value.agent;
            this.user.lastUpdated = new Date();
            this.user.id = this.generatedId
            this.user.language = this.userForm.value.language;

              this.saveSelectedAccessCodes()
              this.updateUserWithSelectedProducts();
              

              this.apiService.postdata(this.user).subscribe((postResponse: any) => {

                this.router.navigate(['/home']);
                this.userForm.reset();
              });
            }
          });
        });
      }
    }else {
      // Mark all form controls as touched to trigger validation errors
      this.markFormGroupTouched(this.userForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  saveSelectedProducts() {
    this.updateUserWithSelectedProducts();
  }

  resetAccessStatus() {
    this.SecLookup.forEach((item: { status: boolean; }) => {
      item.status = false;
    });
  }

  toggleAccessCodes(index: number) {

    this.resetAccessStatus()
    this.accessGroup[index].selected = !this.accessGroup[index].selected;
    this.selectedGroupId = this.accessGroup[index].id;
    const accessCodesInGroup = this.accessGroup[index].sAccessCodes;

    for (let i = 0; i < accessCodesInGroup.length; ++i) {
      for (let j = 0; j < this.SecLookup.length; ++j) {
        if (accessCodesInGroup[i] === this.SecLookup[j].sAccessCode) {
          this.SecLookup[j].status = true;
          break;
        }
      }
    }

  }

  refreshPage() {
    location.reload();
  }

  toggleAccessCode(accesscode: any) {
    // console.log('Selected Codes:', this.selectedAccessCodes);
    accesscode.selected = !accesscode.selected;

    if (accesscode.selected) {
      this.selectedAccessCodes.push(accesscode.sAccessCode);
      this.solvingarray.push(accesscode.sAccessCode)
      // console.log('Selected Codes:', this.selectedAccessCodes);
    } else {
      const index = this.selectedAccessCodes.indexOf(accesscode.sAccessCode);
      if (index !== -1) {
        this.selectedAccessCodes.splice(index, 1);
      }
      // console.log('Selected Codes:', this.selectedAccessCodes);
    }
  }








  saveSelectedAccessCodes(): void {

    const selectedCodes = this.accessCodes.filter((code: any) => code.selected);
    const selectedGroups = this.accessGroup.filter(group => group.selected);
    const accessGroupsOnly = selectedGroups.map(group => group.sAccessGroup);
    const accessCodesArray: string[] = selectedGroups.reduce((acc, group) => acc.concat(group.sAccessCodes), [] as string[]);

    for (const codes of this.selectedAccessCodes) {
      console.log('here is the staff brother  '+codes)
      accessCodesArray.push(codes);
      console.log(accessCodesArray)
    }
    const accessCodesSet = new Set(accessCodesArray);
    const accessCodesArray1 = Array.from(accessCodesSet);
    const userAccessGroups = {
      AccessGroups: accessGroupsOnly,
      id: this.user.id
    }

    const userAccesscodes = {
      id: this.user.id,
      accesscodes : accessCodesArray1
    }
   
    this.apiService.addUserAccessCodes(userAccesscodes).subscribe(
      (response: any) => {
        // console.log('Success:', response);
      },
      (error: any) => {
        // console.error('Error:', error);
      }
    );
    this.apiService.addUserGroups(userAccessGroups).subscribe(
      (res: any) => {
        
      },
      (error: any) => {
        // Handle errors
        // console.error(error);
      }
    );
  }
// Add this method to your component class
hasRequiredFields(): boolean {
  // Check if any of the fields in the "User-Details" tab are invalid
  return !! (
    this.isControlInvalid('username') ||
    this.isControlInvalid('fullname') ||
    this.isControlInvalid('password') ||
    this.isControlInvalid('confirmpassword') ||
    this.isControlInvalid('email') ||
    this.isControlInvalid('department') ||
    this.isControlInvalid('agent') ||
    this.isControlInvalid('homephone') ||
    this.isControlInvalid('description') ||
    this.isControlInvalid('language') ||
    this.isControlInvalid('mobile')
  );
}

  onFilterTextChanged() {
    // this.filteredAccessGroup(); 
    console.log( 'Lets see '+this.userForm.value.filterText1)
  }
  
  
  filteredAccessCodes() {
    const filteredArray = this.SecLookup.filter((accessCode: { sAccessCode: string }) =>
      accessCode.sAccessCode.includes(this.userForm.value.filterText1.toUpperCase() )
    );

    // console.log(this.accessGroup)
  //  console.log('this is the access group  ',this.accessGroup)
    return filteredArray;
  }

  filteredAccessGroups() {
    let filteredArray = this.accessGroup.filter((group: { sAccessGroup: string }) =>
      group.sAccessGroup.includes(this.userForm.value.filterText2 )
    );
    const jsonString =JSON.stringify(filteredArray)
    const parsedData = JSON.parse(jsonString);
    // console.log('what is this ',parsedData)
    filteredArray = [] ;
     // Use the map function to extract the sAccessGroup property from each group in parsedData.
    filteredArray = parsedData.map((group: { sAccessGroup: string }) => group.sAccessGroup);

    // console.log('Access Group:', filteredArray)
    return filteredArray;
  }
  
  selectAllCheckbox: boolean = false;

  toggleSelectAll(event: any) {
    this.selectAllCheckbox = event.target.checked;
    this.SecLookup.forEach((accessCode: { sAccessCode: string,status: boolean }) => {
      if(this.selectAllCheckbox){
        accessCode.status = this.selectAllCheckbox;
        console.log('This is what you are adding  ',accessCode.status)
        this.selectedAccessCodes.push(accessCode.sAccessCode)
      }else{
        accessCode.status = this.selectAllCheckbox;
         this.selectedAccessCodes = []
      }
    
    });
  }
  
  

}
