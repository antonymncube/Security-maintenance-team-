import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { SharedDataService } from '../services/shared-data.service';


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
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'weight', 'description', 'agent','department','email','Action'];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  currentuser: string = '';

  constructor(private apiService: ApiServiceService, private router: Router, private autservice: AuthService,
    private SharedDataService:  SharedDataService) { }

  ngOnInit() {
    this.apiService.getData().subscribe((data: PeriodicElement[]) => {
      data = data.slice().reverse(); // Reverse the array
      this.dataSource.data = data; // Set the data source for MatTableDataSource
      this.dataSource.paginator = this.paginator; // Set the paginator

      const storedUser = sessionStorage.getItem('currentuser');
      this.currentuser = storedUser !== null ? storedUser : '';

      this.SharedDataService.filterText$.subscribe((filterText) => {

        this.dataSource.filter = filterText;
      });
    });
  }

  onActionSelected(element: PeriodicElement, action: string) {
    if (action === 'edit') {
      this.router.navigate(['/home/edituser', element.id]);
    } else if (action === 'viewuser') {
      this.router.navigate(['/home/viewuser', element.id]);
    } else if (action === 'toggleStatus') {
      this.toggleUserStatuzs(element.id);
    }
  }

  onDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe(() => {
       
          location.reload();
        });
      }}
   
      toggleUserStatus(user: PeriodicElement): void {
        this.apiService.updateUser(user.id.toString(), {user}).subscribe((data: PeriodicElement[]) => {
          user.status = !user.status;
          console.log('User status updated successfully.');
        });
      }

      toggleUserStatuss(userid: number): void {
        this.apiService.updateUser(userid.toString(), this.apiService.getUserDetails(userid.toString())).subscribe((res: any) => {
          res.status = !res.status;
          console.log('User status updated successfully.');
        });
      }

      toggleUserStatusz(user: PeriodicElement): void {
        user.status = !user.status;
        this.apiService.updateUser(user.toString(), {user}).subscribe((data: PeriodicElement[]) => {
          user.status = !user.status;
          console.log('User status updated successfully.');
        });
      }

      toggleUserStatuszz(user: string): void {
        this.apiService.getUserDetails(user).subscribe((data: any) =>{
        this.dataSource.data = data;
        data
        this.apiService.updateUser(data.id, {data}).subscribe((data: PeriodicElement[]) => {
          
          console.log('User status updated successfully.');
        });
      });
      }

      toggleUserStatuzs(userId: number): void {
        const userToUpdate = this.dataSource.data.find(user => user.id === userId);
      
        if (userToUpdate) {
          userToUpdate.status = !userToUpdate.status;
      
          this.apiService.updateUser(userId.toString(), userToUpdate).subscribe(() => {
            console.log('User status updated successfully.');
          });
        } else {
          console.error('User not found');
        }
      }
    }
