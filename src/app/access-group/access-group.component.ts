import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-access-group',
  templateUrl: './access-group.component.html',
  styleUrls: ['./access-group.component.scss'],
})
export class AccessGroupComponent {
  dataToUpdate :any

  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  accessGroup: Array<{
    clicked: boolean;
    sAccessGroup: string;
    sAccessCodes: Array<string>;
    selected: boolean;
    id:string   
  }> ;
  accessCodes: Array<{
    sAccessCode: string;
    SAccessDescription: string;
    selected: boolean; 
   
  }>;
  selectedGroupId: string ='';
  accessGroundForm: any;

  constructor(
    public dialogRef: MatDialogRef<AccessGroupComponent>,private fb: FormBuilder, private apiService: ApiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.accessGroup = data.accessGroup;  
    this.accessCodes = []; // Initialize accessCodes as an empty array
    this.accesscodes();
  }

  ngOnInit(): void {
    this.accessGroundForm = this.fb.group({
      accessGround: ['', Validators.required]
    });
  }

  accesscodes() {
    this.apiService.getSecLookup().subscribe((data) => {
      this.accessCodes = data;
    });
  }
   
  selectedGroupIndex: number | null = null;
  
  toggleAccessCodes(index: number) {
    this.accessGroup.forEach((group, i) => {
      if (i !== index) {
        group.selected = false;
      }
    });
  
    this.accessGroup[index].selected = !this.accessGroup[index].selected;
  
    // Debugging: Log the group.id
    this.selectedGroupId = this.accessGroup[index].id;

    // console.log(this.selectedGroupId);
  }
  

  selectedAccessCodes: any[] = []; 

  onSubmit() {
    if (this.accessGroundForm.valid) {
      const accessGroundValue = this.accessGroundForm.value.accessGround;
      console.log('Submitted Access Ground: ' + accessGroundValue);
      
    }
  }

  getSelectedAccessCodes(): void {
    this.selectedAccessCodes = this.accessCodes.filter((code) => code.selected);
    // Now, this.selectedAccessCodes contains the selected access codes
  }


  saveSelectedAccessCodes(): void {
    if (this.selectedGroupId === null) {
      console.log("No selected group.");
      return;
    }
  
    const selectedAccessCodes = this.accessCodes.filter((code) => code.selected);
  
    if (selectedAccessCodes.length === 0) {
      console.log("No access codes selected.");
      return;
    }
  
    this.apiService.getAccessGroupById(this.selectedGroupId).subscribe((res) => {
      // console.log(res);
  
      this.dataToUpdate = {
        sAccessGroup: res.sAccessGroup,
        sAccessCodes: selectedAccessCodes.map((code) => code.sAccessCode),

      };  
       
      console.log('respond ' + res.sAccessCodes[0]);
      for (let i = 0; i < res.sAccessCodes.length; i++) {
        const code = res.sAccessCodes[i];
        if (!this.dataToUpdate.sAccessCodes.includes(code)) {
          // Add the code to this.dataToUpdate.sAccessCodes if it doesn't exist
          this.dataToUpdate.sAccessCodes.push(code);
        }
        else {
          console.log('No access codes in the response.');
        }
      }
      
      const dataToUpdateString = JSON.stringify(this.dataToUpdate, null, 2);
  
      this.apiService.updateAccessgroup(this.selectedGroupId, this.dataToUpdate).subscribe((updateRes) => {
      
        this.accessCodes.forEach((code) => {
          code.selected = false;
        });
  
      });
    });
  }
  
  
  
}
