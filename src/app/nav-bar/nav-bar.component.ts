import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {  ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
 

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild(MatSidenav) sidenav!: MatSidenav;


  // this.sidenav.open();
  isSidenavOpen!: boolean;

   

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
