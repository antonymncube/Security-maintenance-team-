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
        console.log('is it an object of a user', this.UserAccescodes)
        this.accessCodes = this.accessCodes.map((res) => {
          if (this.UserAccescodes.includes(res.sAccessCode)) {
            res.selected = true;

          }
          return res
        })

      });



      // console.log('the selected is here ', this.accessCodes)
    });





    this.apiService.getUserAccessGroups(this.id).subscribe(
      (data) => {

        // Now that you have UserAccessGroups, you can fetch access groups
        this.apiService.getAccessGroup().subscribe(res => {
          this.UserAccessGroups = data.AccessGroups;
          this.accessGroup = res;
          // console.log('here are your users accessGroups  ' + this.UserAccessGroups)
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
  checkedCodes: Set<string> = new Set<string>();  

  isChecked(accesscode: any): boolean {
    return this.checkedCodes.has(accesscode.sAccessCode);
  }
 
  checkedAccessCodes: any[] = [];

  toggleAccessCodes(index: number) {
    this.resetAccessStatus();
    this.accessGroup[index].selected = !this.accessGroup[index].selected;
    this.selectedGroupId = this.accessGroup[index].id;
    // console.log('Here is the accecodes',this.accessCodes)
    // console.log('here is the seclookup',this.SecLookup)
        console.log('Checked Access Codes:', this.checkedAccessCodes);
     if(!this.accessGroup[index].selected){
       this.accessGroup.map(res=>{
        if(this.accessGroup[index].sAccessGroup == res.sAccessGroup)
        
        this.UserAccescodes = this.UserAccescodes.filter(code => !res.sAccessCodes.includes(code));
        this.selectedAccessCodes = this.selectedAccessCodes.filter(code=>!res.sAccessCodes.includes(code))
       })
     }else{
      const selectedAccessGroup = this.accessGroup[index];
      this.UserAccescodes = this.UserAccescodes.concat(selectedAccessGroup.sAccessCodes);
      this.selectedAccessCodes = this.selectedAccessCodes.concat(selectedAccessGroup.sAccessCodes)
     }

     

       console.log("here are codes all  ",this.selectedAccessCodes)
     

    


    if (!this.accessGroup[index].selected) {
     

      this.selectedAccessCodes.forEach(selectedCode => {
        // Check if the selected code is present in the accessCodes array
        const matchingCode = this.accessCodes.find(code => code.sAccessCode === selectedCode);
        
        // If a matching code is found, set selected to false
        if (matchingCode !== undefined) {
          // Assuming there is a 'selected' property in each access code object
          matchingCode.selected = false; 

        
          // console.log('it is running',matchingCode )
        }
      });}
     else{

  }
    const accessCodesInGroup = this.accessGroup[index].sAccessCodes;
    // console.log('this is the selected group  ',this.accessGroup[index].selected)

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
      // console.log('This is the selected  ', this.selectedAccessCodes)
      console.log("here is the accescodes from accesscode ",this.selectedAccessCodes)
      
    } else {

      // If the access code is unchecked, remove it from both arrays
      const selectedIndex = this.selectedAccessCodes.indexOf(accesscode.sAccessCode);
      if (selectedIndex !== -1) {
        this.selectedAccessCodes.splice(selectedIndex, 1);
        
      //  console.log ('You unchecked this now baba ',accesscode.selected)
      }

      // console.log('you unchecked somehting', this.selectedAccessCodes)

    }
    accesscode.selected = !accesscode.selected;

    console.log( 'LETS SEE SOMETHING  '+this.selectedAccessCodes)
    // this.saveSelectedAccessCodes();
   
  }


  saveSelectedAccessCodes(): void {
    const updatedcodesset = new Set();
    let accessCodesSet = new Set();

    console.log("The lenght of the access codes ",this.selectedAccessCodes)
    

    this.accessGroup.map((res) => {
      if (res.selected) {
        updatedcodesset.add(res.sAccessGroup)

      }
    })

    const updatedcodesArray = Array.from(updatedcodesset);
 

      this.apiService.getAccessGroup().subscribe((res: any) => {
        // console.log('how about here ke ', res);
        const groupaccesscodes = new Set<string>();
    
        for (let index = 0; index < res.length; index++) {
            const accessGroup = res[index];
            const accessgroup1 = JSON.stringify(accessGroup, null, 2);
            const parsedObject = JSON.parse(accessgroup1);
    
            // console.log('Outer Loop: ', parsedObject.sAccessGroup);
    
            // Inner loop
            for (let innerIndex = 0; innerIndex < updatedcodesArray.length; innerIndex++) {
                if (parsedObject.sAccessGroup == updatedcodesArray[innerIndex]) {
                  parsedObject.sAccessCodes.forEach((res: string) => {
                    groupaccesscodes.add(res);
                });
                  
                   
                    console.log('this is what happens mshana ',groupaccesscodes);

                }
            }
        }
    });
    
 

    this.apiService.updateUserAccessgroup(this.id, { id: this.id, AccessGroups: updatedcodesArray }).subscribe(
      (res: any) => {
        // Handle successful response
        // console.log('Update successful:', res);
    
        // Check if any of the updated access codes exist in accessGroup
        (updatedcodesArray as string[]).forEach(updatedCode => {
          const groupContainingCode = this.accessGroup.find(group => group.sAccessGroup.includes(updatedCode));
    
          if (groupContainingCode) {
            // Access group exists, log a message and loop through access codes
            console.log(` exists in group ${groupContainingCode.sAccessGroup}.`);
    
            groupContainingCode.sAccessCodes.forEach(accessCode => {
              console.log('accescodes',accessCode)
              this.selectedAccessCodes.push(accessCode)
              accessCodesSet.add(accessCode)
            });
          } else {
            // console.log(`Access code ${updatedCode} does not exist in any group.`);
          }
        });
      },
      (error: any) => {
        // Handle error response
        console.error('Update failed:', error);
      }
    );
    
    
    
   

   



    // console.log( 'here are the saved codes ',updatedcodesArray);
    // this.apiService.updateAccessgroup(this.id,)

    const selectedCodes = this.accessCodes.filter((code: any) => code.selected);
    const selectedGroups = this.accessGroup.filter(group => group.selected);
    const accessGroupsOnly = selectedGroups.map(group => group.sAccessGroup);
    let accessCodesArray: string[] = selectedGroups.reduce((acc, group) => acc.concat(group.sAccessCodes), [] as string[]);
    // console.log('Ahead save  ',this.selectedAccessCodes)
    // console.log('Ahead save  ', this.selectedAccessCodes);

    // for (const codes of this.selectedAccessCodes) {
    //   if (codes.sAccessCode && codes.sAccessCode.length > 0) {
    //     console.log('Ahead save  ', codes.sAccessCode);
    
    //     // Using concat method to flatten the array
    //     accessCodesArray = accessCodesArray.concat(codes.sAccessCode);
    
    //     // Alternatively, using the spread operator
    //     // accessCodesArray.push(...codes.sAccessCode);
    //   }
    // }
    this.selectedAccessCodes.map(res=>{
      
        accessCodesArray.push(res)
      
      
      })
      console.log('lets see now  buti boi'+accessCodesArray)
   
    accessCodesSet.add(accessCodesArray)  
    
   

    let accessCodesArray1 = Array.from(accessCodesSet);

   
    const userAccessGroups = {
      AccessGroups: accessGroupsOnly,
      id: this.id
    }
    let uniqueCodes = [...new Set(this.selectedAccessCodes)];
    this.selectedAccessCodes.push(...accessCodesArray1.filter(code => !uniqueCodes.includes(code)));
    const userAccesscodes = {
      id: this.id,
      accesscodes: accessCodesArray1
    }
    accessCodesArray1 = [...new Set(accessCodesArray1.flat())];
    console.log('check for duplicates ',accessCodesArray1)
    this.apiService.updateUserAccessCodes(this.id,{accesscodes:accessCodesArray1} ).subscribe(
      (res: any) => {
        // Handle successful response
        console.log('Update successful:', res);
      },
      (error: any) => {
        // Handle error
        console.error('Update failed:', error);
      }
    );
 
    }
  
}