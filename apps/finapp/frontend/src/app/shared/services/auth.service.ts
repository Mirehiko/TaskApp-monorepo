import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = null;
  public user: any;

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  login(quser: User): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>('/api/auth/login', quser).pipe(
      tap(({ token, user }) => {
        localStorage.setItem('auth-token', token);
        this.setToken(token);
        this.user = user;
        localStorage.setItem('permit', `${JSON.stringify(user)}`);
      })
    );
  }

  logout(): void {
    this.setToken(null);
    this.user = null;
    localStorage.clear();
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
