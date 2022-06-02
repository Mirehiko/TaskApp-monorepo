import { Injectable } from "@angular/core";
import { AuthResponseDto, AuthUserDto, UserResponseDto } from '@finapp/app-common';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: "root" })
export class AuthRestService {
  private baseUrl: '/api/auth';

  constructor(
    private http: HttpClient,
  ) {
  }

  public async login(authUserDto: AuthUserDto): Promise<AuthResponseDto> {
    return await this.http.post<AuthResponseDto>(`${this.baseUrl}/login`, authUserDto).toPromise().then(res => {
      return res as AuthResponseDto;
    });
  }

  public async logout(authUserDto: AuthUserDto): Promise<void> {
    return await this.http.post<AuthResponseDto>(`${this.baseUrl}/logout`, authUserDto).toPromise().then(res => {
      // return res as AuthResponseDto;
    });
  }

  public async register(authUserDto: AuthUserDto): Promise<void> {
    return await this.http.post<AuthResponseDto>(`${this.baseUrl}/registration`, authUserDto).toPromise().then(res => {
      // return res as AuthResponseDto;
    });
  }

  public async forgotPassword(authUserDto: AuthUserDto): Promise<void> {
    return await this.http.post<AuthResponseDto>(`${this.baseUrl}/forgotPassword`, authUserDto).toPromise().then(res => {
      // return res as AuthResponseDto;
    });
  }

  public async changePassword(authUserDto: AuthUserDto): Promise<void> {
    return await this.http.post<AuthResponseDto>(`${this.baseUrl}/change-password`, authUserDto).toPromise().then(res => {
      // return res as AuthResponseDto;
    });
  }

  public async confirm(authUserDto: AuthUserDto): Promise<void> {
    return await this.http.post<AuthResponseDto>(`${this.baseUrl}/confirm`, authUserDto).toPromise().then(res => {
      // return res as AuthResponseDto;
    });
  }

  public async getUserByToken(token: string | null): Promise<UserResponseDto> {
    return await this.http.post<UserResponseDto>(`${this.baseUrl}/by-token`, { data: { token: token }}).toPromise().then(res => {
      return res as UserResponseDto;
    });
  }
}
