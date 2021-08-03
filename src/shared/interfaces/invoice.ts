import { UserResponse } from "./user";

export interface InvoiceResponse {
  id: number;
  name: string;
  description?: string;
  balance: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy: UserResponse;
  updatedBy?: UserResponse;
  type: InvoiceResponse;
}

export interface InvoiceRequest {
  id?: number;
  name: string;
  description: string;
  balance: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: UserResponse;
  updatedBy: UserResponse;
  type: InvoiceResponse;
}
