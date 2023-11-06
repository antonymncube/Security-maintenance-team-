import { Component, ViewChild } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';

import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
//import shared data service
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss']
  
})
export class MasterLayoutComponent {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @ViewChild(NavBarComponent) navBarComponent: NavBarComponent | undefined;

  constructor(private dialog: MatDialog,private autservice:AuthService, private SharedDataService:  SharedDataService) {}
  

  openDialog() {
    const dialogRef = this.dialog.open(MasterLayoutComponent, { restoreFocus: false });

    // Since we used the ! operator, there's no need to check for null
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
    
  }
  

 logout(){
  this.autservice.logout()
 }
 
 
 

 searchUsers(event: Event) {
  const filterText = (event.target as HTMLInputElement).value;
  this.SharedDataService.updateFilterText(filterText);
}


About(){

}
}
