import { OperationType } from "../enums/finance/operation-types";
import { InvoiceResponse } from './invoice';
import { UserResponse } from './user';
import { CategoryResponse } from './category';

export interface OperationResponse {
  id: number;
  comment: string;
  value: number;
  type: OperationType;
  invoice: InvoiceResponse;
  providedBy: UserResponse;
  providedAt: string | Date;
  metadata?: OperationMetadata;
}

export interface OperationRequest {
  id?: number;
  comment?: string;
  value: number;
  type: OperationType;
  invoice: InvoiceResponse;
  providedBy: UserResponse;
  providedAt: string | Date;
  metadata?: OperationMetadata;
}

export interface OperationMetadata {
  invoice: InvoiceResponse;
  category: CategoryResponse;
}
