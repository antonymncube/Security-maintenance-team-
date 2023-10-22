import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/Users');
  }

  postdata(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/Users', data).pipe(
      map((res: any) => res)  
    );
  }

  // Update user data based on ID
  updateUser(id: string, data: any): Observable<any> {
    const url = `http://localhost:3000/Users/${id}`;
    return this.http.put(url, data).pipe(
      map((res: any) => res)
    );
  }

  // Get user details based on ID
  getUserDetails(id: string): Observable<any> {
    const url = `http://localhost:3000/Users/${id}`;
    return this.http.get<any>(url);
  }
  checkUsernameExist(username: string): Observable<boolean> {
    const url = `http://localhost:3000/Users?username=${username}`;
    return this.http.get<any[]>(url).pipe(
      map(users => users.length > 0)
    );
  }
}
