import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Target, Message, Bill } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TargetService {
  constructor(private http: HttpClient) {}

  fetch(params: any = {}): Observable<Target[]> {
    return this.http.get<Target[]>('/api/target', {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  getTargetsByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`/api/target/user/${userId}`);
  }

  getTargetById(targetId: string): Observable<{target: Target, bill: Bill}> {
    return this.http.get<{target: Target, bill: Bill}>(`/api/target/${targetId}`);
  }

  create(target: Target): Observable<Target> {
    return this.http.post<Target>('/api/target', target);
  }

  update(targetId: string, target: Target): Observable<Target> {
    return this.http.patch<Target>(`/api/target/${targetId}`, target);
  }

  delete(target: Target): Observable<Message> {
    return this.http.delete<Message>(`/api/target/${target._id}`);
  }
}
