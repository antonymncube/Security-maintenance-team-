import { Component, ViewChild } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
 

@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss']
})
export class MasterLayoutComponent {
  @ViewChild(NavBarComponent) navBarComponent: NavBarComponent | undefined;

  constructor() {}

   
}
