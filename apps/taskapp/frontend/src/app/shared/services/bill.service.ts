import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill, Message } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(private http: HttpClient) {}

  fetch(params: any = {}): Observable<Bill[]> {
    return this.http.get<Bill[]>('/api/bills', {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  getBillsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`/api/bill/user/${userId}`);
  }

  getBillById(billId: number): Observable<Bill> {
    return this.http.get<Bill>(`/api/bill/${billId}`);
  }

  create(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>('/api/bill', bill);
  }

  update(billId: number, bill: Bill): Observable<Bill> {
    return this.http.patch<Bill>(`/api/bill/${billId}`, bill);
  }

  delete(billId: number): Observable<Message> {
    return this.http.delete<Message>(`/api/bill/${billId}`);
  }
}
