import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';
import { ModifyAccesCodesComponent } from '../modify-acces-codes/modify-acces-codes.component';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild('drawer') drawer!: MatSidenav;
  SecLookup: any = '';

  constructor(public dialog: MatDialog, private apiService: ApiServiceService) { }

  openDialog() {
    // Fetch the data before opening the dialog
    this.getAccesslookup();
  }

  getAccesslookup() {
    this.apiService.getSecLookup().subscribe((SecLookup: any) => {
      this.SecLookup = SecLookup; // Assign the entire response to SecLookup
      console.log('API Response:', SecLookup);
      console.log('Security Access:', SecLookup[0].sAccessCode, 'Security Description', SecLookup[0].SAccessDescription);
      console.log("Data is available, opening the dialog.");
      this.openDialogWithSecLookup(this.SecLookup);
    });
  }

  openDialogWithSecLookup(SecLookup: any) {
    const dialogRef = this.dialog.open(ModifyAccesCodesComponent, {
      width: '700px',
      data: { SecLookup } // Pass SecLookup data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle dialog close or any result from the dialog (if needed)
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
}
