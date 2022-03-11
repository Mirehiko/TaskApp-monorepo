import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, Role } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  fetch(params: any = {}): Observable<Role[]> {
    return this.http.get<Role[]>('/api/category', {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  getRoleById(roleId: string): Observable<Role> {
    return this.http.get<Role>(`/api/role/${roleId}`);
  }

  create(role: Role): Observable<Role> {
    return this.http.post<Role>('/api/category', role);
  }

  update(roleId: string, data: Role): Observable<Role> {
    return this.http.patch<Role>(`/api/role/${roleId}`, data);
  }

  delete(role: Role): Observable<Message> {
    return this.http.delete<Message>(`/api/role/${role}`);
  }
}
