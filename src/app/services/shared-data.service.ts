import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  hideAccessGroupsTable() {
    throw new Error('Method not implemented.');
  }
  hideAccessCodesTable() {
    throw new Error('Method not implemented.');
  }
  private filterTextSubject = new BehaviorSubject<string>('');
  private accessCodesVisibleSubject = new BehaviorSubject<boolean>(false);
  private accessGroupsVisibleSubject = new BehaviorSubject<boolean>(false);

  filterText$ = this.filterTextSubject.asObservable();
  accessCodesVisible$ = this.accessCodesVisibleSubject.asObservable();
  accessGroupsVisible$ = this.accessGroupsVisibleSubject.asObservable();

  updateFilterText(filterText: string) {
    this.filterTextSubject.next(filterText);
  }

}