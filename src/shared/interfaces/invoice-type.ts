export interface InvoiceTypeResponse {
  id: number;
  name: string;
  displayName: string;
}

export interface InvoiceTypeRequest {
  id?: number;
  name: string;
  displayName: string;
}
