import { UserResponse } from './user';

export interface GroupResponse {
  id: number;
  name: string;
  description: string;
  participants: UserResponse[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy: UserResponse;
  updatedBy?: UserResponse;
}

export interface GroupRequest {
  id?: number;
  name: string;
  description: string;
  participants: UserResponse[];
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: UserResponse;
  updatedBy: UserResponse;
}
