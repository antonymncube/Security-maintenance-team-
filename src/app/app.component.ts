import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SecurityMaintenence';
 
  isSideNavCollapsed = true;
  screenWidth = 0;
  onToggleSideNav(data: SideNavToggle): void{
   this.isSideNavCollapsed = data.collapsed;
   this.screenWidth =data.screenWidth;
 }
 
}
