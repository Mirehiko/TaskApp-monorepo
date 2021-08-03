import { UserResponse } from './user';

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: UserResponse;
  updatedBy: UserResponse;
}

export interface CommentRequest {
  id?: number;
  content: string;
  creator: UserResponse;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: UserResponse;
  updatedBy: UserResponse;
}
