import { Component, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';
import { ModifyAccesCodesComponent } from '../modify-acces-codes/modify-acces-codes.component';
import { ApiServiceService } from '../services/api-service.service';
import { AccessGroupComponent } from '../access-group/access-group.component';
import { Router } from '@angular/router';
import { navbarData } from './narbardata';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
        style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('3ms',
        style({opacity: 0}))
      ])
    ]),
    trigger('rotate',[
      transition(':enter', [
        animate('1000ms',
        keyframes([
          style({transform: 'rotate(0deg)', offset: '0'}),
          style({transform: 'rotate(2turn)', offset: '1'})
        ]))
      ])
    ])
  ]
})
export class NavBarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild('drawer') drawer!: MatSidenav;
  SecLookup: any = '';
  accessGroup : any = '';
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData =navbarData;
  @HostListener('window:resize', ['$event'])

  onResize(event: any){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768){
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});

    } 
  }

  constructor(public dialog: MatDialog, private apiService: ApiServiceService, public router: Router) { }

  openDialog() {
    // Fetch the data before opening the dialog
    this.getAccesslookup();
  }

  getAccesslookup() {
    this.apiService.getSecLookup().subscribe((SecLookup: any) => {
      this.SecLookup = SecLookup; // Assign the entire response to SecLookup
      // console.log('API Response:', SecLookup);
      // console.log('Security Access:', SecLookup[0].sAccessCode, 'Security Description', SecLookup[0].SAccessDescription);
      // console.log("Data is available, opening the dialog.");
      this.openDialogWithSecLookup(this.SecLookup);
    });
  }


  getAccessGroup() {
    this.apiService.getAccessGroup().subscribe((accessGroup: any) => {
      this.accessGroup = accessGroup;
      this.openDialogWithAccessGroup(accessGroup);
    });
  }

  openDialogWithSecLookup(SecLookup: any) {
    const dialogRef = this.dialog.open(ModifyAccesCodesComponent, {
      width: '800px',
      height:'500px',
      data: { SecLookup } // Pass SecLookup data to the dialog
    });


    dialogRef.afterClosed().subscribe((result) => {

      console.log('The dialog was closed');
    });
  }

  openDialogWithAccessGroup(accessGroup: any) {

    const dialogRef = this.dialog.open(AccessGroupComponent, {
      width: '850px',
      height:'550px',
      data: {accessGroup},

    });


    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }


  toggle() {
    this.drawer.toggle();
  }

  // this.sidenav.open();
  isSidenavOpen!: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    refreshPage() {
      location.reload();
    }


navigateToHome() {

  this.router.navigate(['/home']).then(() => {

      window.location.reload();
  });
}

// responsiveness

ngOnInit(): void{
  this.screenWidth = window.innerWidth;
}

toggleCollapse(): void{
  this.collapsed = !this.collapsed;
  this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});

}
closeSidenav(): void{
  this.collapsed = false;
  this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
}
}
