import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, Category } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  fetch(params: any = {}): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category', {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${categoryId}`);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>('/api/category', category);
  }

  update(categoryId: string, data: Category): Observable<Category> {
    return this.http.patch<Category>(`/api/category/${categoryId}`, data);
  }

  delete(categoryId: string): Observable<Message> {
    return this.http.delete<Message>(`/api/category/${categoryId}`);
  }
}
