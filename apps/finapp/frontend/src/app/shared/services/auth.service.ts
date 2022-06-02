import { Injectable } from '@angular/core';
import { AuthResponseDto, AuthUserDto, UserResponseDto } from '@finapp/app-common';
import { Router } from '@angular/router';
import { AuthRestService } from './auth-rest.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  public user: UserResponseDto;
  // public user: UserResponseDto;

  constructor(
    private authRestService: AuthRestService,
    private router: Router
  ) {}

  // register(user: User): Observable<User> {
  //   return this.http.post<User>('/api/auth/register', user);
  // }

  async login(authUserDto: AuthUserDto): Promise<void> {
    const response =  await this.authRestService.login(authUserDto);
    // this.user = response.user;
    // this.setToken(response.token);
    // localStorage.setItem('permit', `${JSON.stringify(user)}`);
  }

  async logout(): Promise<void> {
    this.user = null as unknown as UserResponseDto;
    this.removeToken()
    await this.router.navigate([ "/login" ]);
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth-token', token);
  }

  removeToken(): void {
    this.token = '';
    localStorage.removeItem('auth-token');
  }

  getToken(): string | null {
    this.token = localStorage.getItem('authToken');
    return this.token;
  }

  async getUser(): Promise<UserResponseDto> {
    if (!this.user) {
      try {
        this.user = await this.authRestService.getUserByToken(this.getToken());
      }
      catch (e) {
        await this.logout();
      }
    }

    return this.user;
  }

  async isAuthenticated(): Promise<boolean> {
    await this.getUser();
    return !!this.user;
  }
}
