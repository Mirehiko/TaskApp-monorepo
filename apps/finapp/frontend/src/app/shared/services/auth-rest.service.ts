import { Injectable } from "@angular/core";
import { AuthResponseDto, AuthUserDto, UserResponseDto } from '@finapp/app-common';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: "root" })
export class AuthRestService {
  constructor(
    private http: HttpClient,
  ) {
  }

  public async login(authUserDto: AuthUserDto): Promise<AuthResponseDto> {
    return await this.http.post<AuthResponseDto>('/api/auth/login', authUserDto).toPromise().then(res => {
      return res as AuthResponseDto;
    });
  }

  public async getUserByToken(token: string | null): Promise<UserResponseDto | undefined> {
    return await this.http.post<UserResponseDto>('auth/by-token', { data: { token: token }}).toPromise();
  }
}
