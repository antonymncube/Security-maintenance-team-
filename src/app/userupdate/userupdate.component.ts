import { PasswordHashingService } from './../services/password-hashing.service';
import { ChangeDetectorRef, Component } from '@angular/core';
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
    private PasswordHashingService: PasswordHashingService, private _detector: ChangeDetectorRef) {
    this.accessCodes = [];
    this.accessGroup = [];


    apiService.getAccessGroup().subscribe(res => {
      this.accessGroup = res;
      // console.log("here are the groups" + this.accessGroup)
      this.filteredAccessGroups(this.accessGroup,null);


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
      description: ['',],
      email: ['', [Validators.required, Validators.email]],
      homephone: ['', [Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      mobile: ['', [Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      department: ['', [Validators.required]],
      agent: ['', [Validators.required]],
      language: ['',],
      filterText1: this.filterTextControl1,
      filterText2: this.filterTextControl2,
    });

    this.markFormGroupAsTouchedAndDirty(this.userForm);
  }
  markFormGroupAsTouchedAndDirty(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();

      if (control instanceof FormGroup) {
        this.markFormGroupAsTouchedAndDirty(control);
      }
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
    console.log('Initial filterText2 value:', this.userForm.value.filterText2);
    // setImmediate(this.filteredAccessGroups,2000)


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
    } else {
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

  existsInAccessCodesForItem(accesscodes: any): boolean {
    return this.selectedAccessCodes.includes(accesscodes.sAccessCode);
  }
  

  toggleAccessCodes(index: number) {
    this.resetAccessStatus();
    this.accessGroup[index].selected = !this.accessGroup[index].selected;
    this.selectedGroupId = this.accessGroup[index].id;

    
    if (!this.accessGroup[index].selected) {
      this.accessGroup.map(res => {
        if (this.accessGroup[index].sAccessGroup == res.sAccessGroup)
        this.selectedAccessCodes = this.selectedAccessCodes.filter(code => !res.sAccessCodes.includes(code))
      })
    } else {
      const selectedAccessGroup = this.accessGroup[index];
      this.selectedAccessCodes = this.selectedAccessCodes.concat(selectedAccessGroup.sAccessCodes)
    }



    





    if (!this.accessGroup[index].selected) {


      this.selectedAccessCodes.forEach(selectedCode => {
        // Check if the selected code is present in the accessCodes array
        const matchingCode = this.accessCodes.find(code => code.sAccessCode === selectedCode);

        // If a matching code is found, set selected to false
        if (matchingCode !== undefined) {
          // Assuming there is a 'selected' property in each access code object
          matchingCode.selected = false;
        }
      });
    }
    else {

    }
    const accessCodesInGroup = this.accessGroup[index].sAccessCodes;

    for (let i = 0; i < accessCodesInGroup.length; ++i) {
      for (let j = 0; j < this.accessCodes.length; ++j) {
        if (accessCodesInGroup[i] === this.accessCodes[j].sAccessCode.code) {
          // this.SecLookup[j].status = true;
          this.accessCodes[j].sAccessCode.status = true
          console.log(this.accessCodes[j].sAccessCode.status)
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
      accesscodes: accessCodesArray1
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
    return !!(
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

  variable: any;
  onFilterTextChanged(event: any) {


    const value = event.target.value;

    this,this.filteredAccessGroups(this.accessGroup,value.length === 0 ? null : value)

    this._detector.markForCheck();

  }


  filteredAccessCodes() {
    const filteredArray = this.SecLookup.filter((accessCode: { sAccessCode: string }) =>
      accessCode.sAccessCode.includes(this.userForm.value.filterText1.toUpperCase())
    );


    return filteredArray;
  }


  filteredresults: any;


  filteredAccessGroups(accessGroup: any, searchKey: string | null) {

    if (!searchKey) {
      this.filteredresults = accessGroup.map((group: { sAccessGroup: string }) => group.sAccessGroup);
    }
    else {
      this.filteredresults = accessGroup.map((group: { sAccessGroup: string }) => group.sAccessGroup)
      .filter((group: string) =>
        group.includes(searchKey))
    }

   console.log(this.filteredresults)
  }



  selectAllCheckbox: boolean = false;

  toggleSelectAll(event: any) {
    this.selectAllCheckbox = event.target.checked;
    this.SecLookup.forEach((accessCode: { sAccessCode: string, status: boolean }) => {
      if (this.selectAllCheckbox) {
        accessCode.status = this.selectAllCheckbox;
        this.selectedAccessCodes.push(accessCode.sAccessCode)
      } else {
        accessCode.status = this.selectAllCheckbox;
        this.selectedAccessCodes = []
      }

    });
  }

  changeSuperUser(event: any) {
    this.apiService.changeSuperUser(event,this.selectedAccessCodes)
  }

 productsfilter(): boolean {
  console.log("here is the super what what",this.selectedAccessCodes)
  return this.selectedAccessCodes.includes('SU01');
}
}
 
