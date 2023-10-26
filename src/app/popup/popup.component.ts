import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

constructor(private autservice:AuthService){

}

  logout(){
    console.log("This is not working")
    this.autservice.logout();
  }
}
