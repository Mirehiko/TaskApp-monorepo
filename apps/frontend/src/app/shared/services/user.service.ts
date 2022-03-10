import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, User } from '../interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserResponseDto } from '../../../../../backend/src/app/modules/common/user/dto/user-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getAll(params: any = {}): Observable<UserResponseDto[]> {
    return this.http.get<any>('/api/users', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getUserById(userId: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`/api/user/${userId}`);
  }

  getUserBy(userId: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`/api/user/${userId}`);
  }

  create(user: UserResponseDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>('/api/operation/', user);
  }

  update(userId: string, data: UserResponseDto): Observable<UserResponseDto> {
    return this.http.patch<UserResponseDto>(`/api/user/${userId}`, data);
  }

  delete(userId: string): Observable<Message> {
    return this.http.delete<Message>(`/api/user/${userId}`);
  }
}
