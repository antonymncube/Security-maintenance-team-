import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { SharedDataService } from '../services/shared-data.service';
import { FormBuilder} from '@angular/forms';



export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  description: string;
  agent: string;
  password: string;
  email: string;
  homephone: string;
  mobile: string;
  department: string;
  status: boolean;
  id: number; // Add the 'id' property with the appropriate data type (e.g., number)
  // Add more properties as needed
  lastUpdated: Date;
  fullname: String;
  username : String;


}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'weight', 'description', 'agent', 'department', 'lastUpdated','Action'];

  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  currentuser: string = '';
  statusFilterControl = this.formBuilder.control('');
  UserForm: any;
  userForm: any;

  currentUserFullName: string = '';



  constructor(private apiService: ApiServiceService, private router: Router, private autservice: AuthService,
    private SharedDataService:  SharedDataService, private formBuilder: FormBuilder) { }

    ngOnInit() {
      this.apiService.getData().subscribe((data: PeriodicElement[]) => {
        data = data.slice().reverse(); // Reverse the array
        this.dataSource.data = data; // Set the data source for MatTableDataSource
        this.dataSource.paginator = this.paginator; // Set the paginator
        
        // this.apiService.addUserAccessCodes(this.)
        const storedUser = sessionStorage.getItem('currentuser');
        this.currentuser = storedUser !== null ? storedUser : '';


           const currentUser = data.find(user => user.username === this.currentuser);
           console.log(currentUser);
           this.currentUserFullName = currentUser ? currentUser.fullname.toString() : '';


        this.SharedDataService.filterText$.subscribe((filterText) => {
          this.dataSource.filter = filterText;


      });
    });
    this.statusFilterControl.valueChanges.subscribe((status: string | null) => {
      this.applyStatusFilter(status);
    });
  }

  onActionSelected(element: PeriodicElement, action: string) {
    if (action === 'edit') {
      this.router.navigate(['/home/edituser', element.id]);
    } else if (action === 'viewuser') {
      this.router.navigate(['/home/viewuser', element.id]);
    } else if (action === 'toggleStatus') {
      this.toggleUserStatus(element.id);
    } else if (action === 'delete') {
      // this.onDeleteUser(element.id);
    }
  }

  userType(userId: string): any{
     this.apiService.getUserAccessCodes(userId).subscribe((res)=>{

     return res.includes('SU01')

     })
  }



      toggleUserStatus(userId: number): void {
        const userToUpdate = this.dataSource.data.find(user => user.id === userId);

        if (userToUpdate) {
          userToUpdate.status = !userToUpdate.status;

          this.apiService.updateUser(userId.toString(), userToUpdate).subscribe(() => {
            console.log('User status updated successfully.');
            this.dataSource.data = this.dataSource.data.map(u => (u.id === userId ? userToUpdate : u));
          });
        } else {
          console.error('User not found');
        }
      }

      applyStatusFilter(status: string | null): void {
        if (status === null || status === '') {
          // If status is null, no filter should be applied
          this.dataSource.filter = '';

        } else {
          // Otherwise, apply the filter based on the boolean value
          this.dataSource.filter = status === 'true' ? 'true' : 'false';
        }
      }

      

    markAllAsTouched() {
      Object.keys(this.UserForm.controls).forEach(controlName => {
        this.userForm.get(controlName)?.markAsTouched();
      });
    }

    
  }
