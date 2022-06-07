import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';


export abstract class BaseRestService {
  public baseUrl = 'http://localhost:5000/api/main';

  constructor(protected http: HttpClient) {
  }

  public async doRequest<T>(httpMethod: string, url: string, data?: any, options?: any): Promise<T> {
    return new Promise<T>( (ok, fail) => {
      const sub = new Subscription();

      sub.add(
        this.http.request(httpMethod, url, data).subscribe((response: any) => {
          if (sub) {
            sub.unsubscribe();
          }
          ok(response.body as T)
        }, (error) => {
          if (sub) {
            sub.unsubscribe();
          }
          fail(error);
        })
      );
    });
  }

  public async POST<T>(url: string, data?: any, options?: any): Promise<T> {
    return await this.doRequest<T>('post', url, data, options);
  }

  public async GET<T>(url: string, data?: any, options?: any): Promise<T> {
    return await this.doRequest<T>('get', url, data, options);
  }

  public async PATCH<T>(url: string, data?: any, options?: any): Promise<T> {
    return await this.doRequest<T>('patch', url, data, options);
  }

  public async DELETE<T>(url: string, data?: any, options?: any): Promise<T> {
    return await this.doRequest<T>('delete', url, data, options);
  }

  public async PUT<T>(url: string, data?: any, options?: any): Promise<T> {
    return await this.doRequest<T>('pu', url, data, options);
  }
}
