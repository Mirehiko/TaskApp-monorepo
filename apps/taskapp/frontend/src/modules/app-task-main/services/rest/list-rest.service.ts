import { Injectable } from "@angular/core";
import {
  IListGetParams,
  ListRequestDto,
  ListResponseDto,
} from '@taskapp/app-common';
import { HttpClient} from '@angular/common/http';
import { BaseTreeEntityRestService } from './base-tree-entity-rest.service';


@Injectable({ providedIn: "root" })
export class ListRestService extends BaseTreeEntityRestService<ListRequestDto, ListResponseDto, IListGetParams> {
  constructor(
    http: HttpClient,
  ) {
    super(http, 'list');
  }

  public async getList(): Promise<ListResponseDto[]> {
    return await this.GET<ListResponseDto[]>(`${this.baseUrl}/lists`);
  }
}
