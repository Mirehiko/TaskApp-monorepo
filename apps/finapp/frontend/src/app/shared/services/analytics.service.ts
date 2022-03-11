import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  userShotInfo(userId: string): Observable<any> {
    return this.http.get<any>(`/api/analytics/user/${userId}`);
  }

}
