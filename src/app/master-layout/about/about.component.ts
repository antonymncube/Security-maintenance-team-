import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    // Initialize your form here if needed
    this.myForm = this.formBuilder.group({
    });
  }
  onsubmit() {
    console.log(this.myForm)
}
OK(){
  
}
}
