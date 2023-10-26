import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
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

  constructor(private apiService: ApiServiceService, private router: Router, private autservice: AuthService) { }

  ngOnInit() {
    this.apiService.getData().subscribe((data: PeriodicElement[]) => {
      data = data.slice().reverse(); // Reverse the array
      this.dataSource.data = data; // Set the data source for MatTableDataSource
      this.dataSource.paginator = this.paginator; // Set the paginator

      const storedUser = sessionStorage.getItem('currentuser');
      this.currentuser = storedUser !== null ? storedUser : '';
    });
  }

  onActionSelected(element: PeriodicElement, action: string) {
    if (action === 'edit') {
      this.router.navigate(['/home/edituser', element.id]);
    } else if (action === 'viewuser') {
      this.router.navigate(['/home/viewuser', element.id]);
    }
  }


}
