import { UserResponse } from './user';

export interface ThemeResponse {
  id: number;
  name: string;
  createdBy: UserResponse;
  config?: ThemeConfig;
}

export interface ThemeRequest {
  id?: number;
  name: string;
  createdBy: UserResponse;
  config: ThemeConfig;
}

export interface ThemeConfig {
  primaryColor: string;
  primaryTextColor: string;
  background: string;
}
