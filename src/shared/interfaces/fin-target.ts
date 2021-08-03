import { InvoiceResponse } from './invoice';

export interface FinTargetResponse {
  id: number;
  name: string;
  description?: string;
  invoice: InvoiceResponse;
  goalValue?: number;
  goalDate?: string | Date;
}

export interface FinTargetRequest {
  id?: number;
  name: string;
  description?: string;
  invoice: InvoiceResponse;
  goalValue?: number;
  goalDate?: string | Date;
}
