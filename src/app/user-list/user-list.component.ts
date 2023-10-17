import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','agent'];
  dataSource: PeriodicElement[] = [];

  constructor(private apiService: ApiServiceService) {}

  ngOnInit() {
    this.apiService.getData().subscribe((data: PeriodicElement[]) => {
      this.dataSource = data;
    });
  }
}
