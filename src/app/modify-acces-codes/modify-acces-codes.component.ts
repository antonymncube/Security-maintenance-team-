import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { SecLookup } from '../SecAccessLookup';
import { v4 as uuidv4 } from 'uuid';

import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-modify-acces-codes',
  templateUrl: './modify-acces-codes.component.html',
  styleUrls: ['./modify-acces-codes.component.scss']
})
export class ModifyAccesCodesComponent implements OnInit {
  SecLookup: any;
  myForm: any;
  EditForm: any;
  accesscodeid: any;
  securityAccessCode: SecLookup = {
    id: '',
    sAccessCode: '',
    SAccessDescription: ''
  }

  EditForm1 = new FormGroup({
    editcode: new FormControl('', [Validators.required]),
    editdescription: new FormControl('', [Validators.required]),
    accessCodeid: new FormControl('', [Validators.required])

  });

  constructor(
    public dialogRef: MatDialogRef<ModifyAccesCodesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiServiceService,
    private fb: FormBuilder, private renderer: Renderer2
  ) {
    console.log('Constructor is called.');

    this.SecLookup = data.SecLookup;


    this.myForm = this.fb.group({
      code: [''],
      description: ['']
    });



  }

  ngOnInit() {

  }

  toggleaccesscode(secCode: SecLookup) {
    this.accesscodeid = secCode.id;
    console.log('Access Code ID: ' + this.accesscodeid);

    this.apiService.getSecLookupid(this.accesscodeid).subscribe(
      (accessCode: any) => {
        console.log('Response from API:', accessCode);
        this.EditForm1.controls['editcode'].setValue(accessCode.sAccessCode);
        this.EditForm1.controls['editdescription'].setValue(accessCode.SAccessDescription);
        this.EditForm1.controls['accessCodeid'].setValue(accessCode.id);
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }


  updateAccessCode() {
 
    if (this.EditForm1.invalid) return
     
    this.securityAccessCode = {
      sAccessCode: this.EditForm1.value.editcode,
      SAccessDescription: this.EditForm1.value.editdescription,
      id:this.EditForm1.value.accessCodeid
    }
    
    this.apiService.updateAccesscode(this.securityAccessCode).subscribe(
      (response) => {
        console.log('Edit successful:', response);
        this.securityAccessCode = {
          id: '',
          sAccessCode: '',
          SAccessDescription: '',
        }; // Reset the form after successful edit
        this.accesscodeid = null;
      },
      (error) => {
        console.error('Edit error:', error);
        this.accesscodeid = null;
        // You can handle errors here and show a message to the user.
      }
    );

  }

  delete() {

    if (this.accesscodeid >= 0) {

      this.apiService.deleteAccesscode(this.accesscodeid).subscribe(res => {
        alert("Record Deleted")
      })
    }

  }
  onsubmit() {
    console.log(this.myForm)


    if (this.myForm.valid) {
      const accessCode = this.myForm.get('code').value.toUpperCase();

      this.apiService.checkAccessCodeExists(accessCode).subscribe(
        exists => {

          console.log('where' + accessCode)
          if (exists) {
            alert('Access code already exists.');
          } else {

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
