import { Component, Inject } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { SecLookup } from '../SecAccessLookup';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

@Component({
  selector: 'app-modify-acces-codes',
  templateUrl: './modify-acces-codes.component.html',
  styleUrls: ['./modify-acces-codes.component.scss']
})
export class ModifyAccesCodesComponent {
  SecLookup: any;
  myForm: any;
  securityAccessCode: SecLookup = {
    id: '',
    sAccessCode: '',
    SAccessDescription: ''
  }

  constructor(
    public dialogRef: MatDialogRef<ModifyAccesCodesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiServiceService,
    private fb: FormBuilder
  ) {
    this.SecLookup = data.SecLookup;
    this.myForm = this.fb.group({
      code: ['', ],
      description: ['',]
    });
  }

  onsubmit() {

    console.log("it is ")
    if (this.myForm.valid) {
      const accessCode = this.myForm.get('code').value.toUpperCase();
      
      this.apiService.checkAccessCodeExists(accessCode).subscribe(
        exists => {
          if (exists) {
            alert('Access code already exists.');
          } else {
            // Access code is unique; you can proceed to save it
            const generatedId = generateUUID();
            this.securityAccessCode = {
              sAccessCode: accessCode,
              SAccessDescription: this.myForm.get('description').value,
              id: generatedId
            };
            this.myForm.reset();
  
            this.apiService.postsecLookup(this.securityAccessCode).subscribe(
              response => {
                console.log('Request was successful:', response);
              },
              error => {
                console.error('An error occurred:', error);
              }
            );
          }
        }
      );
    }
  }
  

  closeDialog() {
    this.dialogRef.close();
  }
}

function generateUUID() {
  return uuidv4();
}
