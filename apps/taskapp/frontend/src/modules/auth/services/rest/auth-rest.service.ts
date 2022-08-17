import { Injectable } from "@angular/core";
import { AuthResponseDto, AuthUserDto, UserResponseDto } from '@taskapp/app-common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';


@Injectable({ providedIn: "root" })
export class AuthRestService {
  private baseUrl = 'http://localhost:5002/api/auth';

  constructor(
    private http: HttpClient,
  ) {
  }

  public async login(authUserDto: AuthUserDto): Promise<AuthResponseDto> {
    return new Promise<AuthResponseDto>( (ok, fail) => {
      const sub = new Subscription();

      sub.add(
        this.http.post(`${this.baseUrl}/login`, authUserDto).subscribe(res => {
          if (sub) {
            sub.unsubscribe();
          }
          ok(res as AuthResponseDto)
        }, (error) => {
          if (sub) {
            sub.unsubscribe();
          }
          fail(error);
        })
      );
    })

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
    return await this.http.post<UserResponseDto>(`${this.baseUrl}/by-token`, { token: token }).toPromise().then(res => {
      return res as UserResponseDto;
    });
  }
}
