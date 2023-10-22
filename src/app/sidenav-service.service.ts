import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavServiceService {
  private isSidenavOpen = new BehaviorSubject<boolean>(false);

  isSidenavOpen$ = this.isSidenavOpen.asObservable();

  toggleSidenav() {
    this.isSidenavOpen.next(!this.isSidenavOpen.value);
  }
}
