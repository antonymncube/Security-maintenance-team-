import { Component, ViewChild } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
 
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
//import shared data service
import { SharedDataService } from '../services/shared-data.service';
import { AboutComponent } from './about/about.component';
import { Router } from 'express';

@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss'],
  
})
export class MasterLayoutComponent {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @ViewChild(NavBarComponent) navBarComponent: NavBarComponent | undefined;

  Version1: string;
  showPurpose: boolean = false;


  constructor(private dialog: MatDialog,private autservice:AuthService, private SharedDataService:  SharedDataService) {
  this.Version1 = "";
}

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
  this.showPurpose = !this.showPurpose;

}

togglePurpose() {
  this.showPurpose = !this.showPurpose;
}

openDialogWithSecLookupp(SecLookup: any) {
  const dialogRef = this.dialog.open(AboutComponent, {
    width: '800px',
    height:'500px',
    data: { SecLookup } // Pass SecLookup data to the dialog
  });
}

getAccesslookupp() {
    this.openDialogWithSecLookupp(this.About);
  
}
}
