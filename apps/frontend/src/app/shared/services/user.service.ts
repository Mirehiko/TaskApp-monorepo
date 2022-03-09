import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, User } from '../interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getUsers(params: any = {}): Observable<any> {
    return this.http.get<any>('/api/user', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`/api/user/${userId}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>('/api/user/', user);
  }

  update(userId: string, data: User): Observable<User> {
    return this.http.patch<User>(`/api/user/${userId}`, data);
  }

  delete(userId: string): Observable<Message> {
    return this.http.delete<Message>(`/api/user/${userId}`);
  }
}
