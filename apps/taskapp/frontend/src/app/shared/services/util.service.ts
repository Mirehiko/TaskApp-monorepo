import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient) {}

  getBillTypes(): Observable<any> {
    return this.http.get<any>(`/api/utils/bill_types/`);
  }

  getBillStatus(): Observable<any> {
    return this.http.get<any>(`/api/utils/bill_status/`);
  }

  getCardTypes(): Observable<any> {
    return this.http.get<any>(`/api/utils/card_types/`);
  }

  getTargetTypes(): Observable<any> {
    return this.http.get<any>(`/api/utils/target_types/`);
  }

  getOperationTypes(): Observable<any> {
    return this.http.get<any>(`/api/utils/operation_types/`);
  }

  getTargetStatus(): Observable<any> {
    return this.http.get<any>(`/api/utils/target_status/`);
  }
}
