import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Import Observable
import { map } from 'rxjs/operators'; // Import map operator

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
}
 