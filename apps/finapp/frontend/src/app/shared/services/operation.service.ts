import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, Operation } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  constructor(private http: HttpClient) {}

  fetch(params: any = {}): Observable<Operation[]> {
    return this.http.get<Operation[]>('/api/operation', {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  getOperationById(operationId: string): Observable<Operation> {
    return this.http.get<Operation>(`/api/operation/${operationId}`);
  }

  create(operation: Operation): Observable<Operation> {
    return this.http.post<Operation>('/api/operation', operation);
  }

  update(operationId: string, data: Operation): Observable<Operation> {
    return this.http.patch<Operation>(`/api/operation/${operationId}`, data);
  }

  delete(operationId: string): Observable<Message> {
    return this.http.delete<Message>(`/api/operation/${operationId}`);
  }
}
