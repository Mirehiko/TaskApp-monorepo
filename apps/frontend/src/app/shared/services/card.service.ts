import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card, Message } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpClient) {}

  fetch(params: any = {}): Observable<Card[]> {
    return this.http.get<Card[]>('/api/cards', {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  getCardsByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`/api/card/user/${userId}`);
  }

  getCardById(cardId: string): Observable<Card> {
    return this.http.get<Card>(`/api/card/${cardId}`);
  }

  create(card: Card): Observable<Card> {
    return this.http.post<Card>('/api/card', card);
  }

  update(cardId: string, card: Card): Observable<Card> {
    return this.http.patch<Card>(`/api/card/${cardId}`, card);
  }

  delete(cardId: string): Observable<Message> {
    return this.http.delete<Message>(`/api/card/${cardId}`);
  }
}
