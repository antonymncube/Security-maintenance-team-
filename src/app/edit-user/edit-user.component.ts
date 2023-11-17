import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { AvailableProductsComponent } from '../available-products/available-products.component';
import { UserupdateComponent } from '../userupdate/userupdate.component';
import { UserFormData } from '../User';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  id: string = '';
  userForm: FormGroup;
  // userForm: FormGroup;
  user: UserFormData = new UserFormData();
  SecLookup: any = '';
  selectedAccessCodes: any[] = [];
  selectedProducts: string[] = [];
  AvailableCodes: any[] = [];
  selectedAccessGroups: any;
  generatedId: string = '';
  solvingarray: any[] = []
  UserAccescodes: any[] = [];
  UserAccessGroups: any[] | null = null;
  resultArray: Set<any> = new Set();

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
      selected: boolean;
    };
    SAccessDescription: string;
    selected: boolean;

  }>;
  selectedGroupId: string = '';
  accessGroundForm: any;
  selectedGroupIndex: number | null = null;
  alreadyselectedcodes: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private route: ActivatedRoute,
    private router: Router,


  ) {
    this.accessCodes = [];
    this.accessGroup = [];
    this.userForm = this.formBuilder.group({
      id: [''],
      username: [{ value: '', }, Validators.required],
      fullname: ['', Validators.required],
      description: [''],
      password: [{ value: '', }, [Validators.required, Validators.minLength(6)]],
      department: ['',],
      email: ['', [Validators.required, Validators.email]],
      homephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Validate with a regular expression & make it 10 digits
      agent: ['',],
      status: [{ value: '', }],
      lastUpdated: [''],
      language: ['',],
      selectedProducts: [[]],
    });






  }



  ngOnInit() {
    this.getAccesslookup();
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.id = params['id'];
      console.log('We are good here ', this.id);

      this.apiService.getUserDetails(this.id).subscribe((userDetails: any) => {
        if (userDetails && userDetails.selectedProducts) {
          this.userForm.get('selectedProducts')!.setValue(userDetails.selectedProducts);
        }
        this.userForm.patchValue(userDetails);
      });
    });


    this.apiService.getSecLookup().subscribe((res: any) => {

      this.accessCodes = res;
      this.accessCodes = this.accessCodes.map(accesscode => {
        accesscode.selected = false;
        return accesscode
      })

      this.apiService.getUserAccessCodes(this.id).subscribe((res1: any) => {
        this.UserAccescodes = res1.accesscodes;
        this.selectedAccessCodes = this.UserAccescodes
        // console.log('is it an object of a user', this.UserAccescodes)
        this.accessCodes = this.accessCodes.map((res)=>{
          if(this.UserAccescodes.includes(res.sAccessCode)){
            res.selected = true;
            
          }
          return res
        })

      });

    
  
      console.log('the selected is here ', this.accessCodes)
    });

  



    this.apiService.getUserAccessGroups(this.id).subscribe(
      (data) => {

        // Now that you have UserAccessGroups, you can fetch access groups
        this.apiService.getAccessGroup().subscribe(res => {
          this.UserAccessGroups = data.AccessGroups;
          this.accessGroup = res;
          // console.log('After ', this.UserAccessGroups)

          this.accessGroup.forEach(group => {
            // Check if group.sAccessGroup exists in the AccessGroups array
            const existsInAccessGroups = (this.UserAccessGroups as any[]).find((userGroup: any) => userGroup.includes(group.sAccessGroup)) !== undefined;

            if (existsInAccessGroups) {
              group.selected = true;

            } else {
              group.selected = false; // Set to false if there is no match
            }
          });
        });
      },
      (error: any) => {
        this.apiService.getAccessGroup().subscribe(res => {
          this.accessGroup = res;
        })
      }
    );

    this.initializeAlreadySelectedCodes();
  }

  existsInAccessCodesForItem(accesscodes: any): boolean {
    return this.UserAccescodes.includes(accesscodes.sAccessCode);
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

  updateSelectedProducts(selectedProducts: any[]) {
    const selectedProductsControl = this.userForm.get('selectedProducts');
    if (selectedProductsControl) {
      selectedProductsControl.setValue(selectedProducts);
    }
  }

  getAccesslookup() {
    this.apiService.getSecLookup().subscribe((SecLookup: any) => {
      this.SecLookup = SecLookup; // Assign the entire response to SecLookup
    });
  }


  updateUserWithSelectedProducts() {
    this.user.selectedProducts = this.selectedProducts;
  }

  saveSelectedProducts() {
    this.updateUserWithSelectedProducts();
  }

  receiveSelectedProducts(products: string[]) {

    this.selectedProducts = products;

  }


  resetAccessStatus() {
    this.SecLookup.forEach((item: { status: boolean; }) => {
      item.status = false;
    });
  }

  existingCodes() {

  }


  toggleAccessCodes(index: number) {
    this.resetAccessStatus();
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

  accesscodes() {
    this.apiService.getSecLookup().subscribe((data) => {
      this.accessCodes = data;
    });
  }
  // Function to check if a control is invalid and should display as red
  isControlInvalid(controlName: string) {
    const control = this.userForm.get(controlName);
    // console.log('back is hot')

    return control?.invalid && control?.touched;
  }

  getSelectedAccessCodes(): void {
    this.selectedAccessCodes = this.accessCodes.filter((code) => code.selected);

  }

  initializeAlreadySelectedCodes() {
    this.alreadyselectedcodes = Array.from(this.resultArray);
  }


  toggleAccessCode(accesscode: any) {


    if (!accesscode.selected) {
      // If the access code is checked, add it to both arrays
      this.selectedAccessCodes.push(accesscode.sAccessCode);
      // this.solvingarray.push(accessCodeValue);
      console.log('This is the selected  ', this.selectedAccessCodes)
    } else {
     
      // If the access code is unchecked, remove it from both arrays
      const selectedIndex = this.selectedAccessCodes.indexOf(accesscode.sAccessCode);
      if (selectedIndex !== -1) {
        this.selectedAccessCodes.splice(selectedIndex, 1);

      }

      console.log('you unchecked somehting', this.selectedAccessCodes)

    }
    accesscode.selected = !accesscode.selected;
  }


  saveSelectedAccessCodes(): void {

    const selectedCodes = this.accessCodes.filter((code: any) => code.selected);
    const selectedGroups = this.accessGroup.filter(group => group.selected);
    const accessGroupsOnly = selectedGroups.map(group => group.sAccessGroup);
    const accessCodesArray: string[] = selectedGroups.reduce((acc, group) => acc.concat(group.sAccessCodes), [] as string[]);

    for (const codes of this.selectedAccessCodes) {
      accessCodesArray.push(codes.sAccessCode);
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
        console.log('Success:', response);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );



    this.apiService.addUserGroups(userAccessGroups).subscribe(
      (res: any) => {

      },
      (error: any) => {
        // Handle errors
        console.error(error);
      }
    );
  }

}
