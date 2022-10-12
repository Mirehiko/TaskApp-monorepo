import { HttpClient } from '@angular/common/http';
import { MoveDto } from '@taskapp/app-common';
import { BaseEntityRestService } from './base-entity-rest.service';

export abstract class BaseTreeEntityRestService<RequestDto, ResponseDto, GetParams> extends BaseEntityRestService<RequestDto, ResponseDto> {
  constructor(
    http: HttpClient,
    url: string
  ) {
    super(http, url);
  }

  public async getChildrenById(entityId: number): Promise<ResponseDto[]> {
    return await this.GET<ResponseDto[]>(`${this.baseUrl}/${this.url}/${entityId}/children`);
  }

  public async getTree(): Promise<ResponseDto[]> {
    return await this.GET<ResponseDto[]>(`${this.baseUrl}/${this.url}s-tree`);
  }

  public async getList(): Promise<ResponseDto[]> {
    return await this.GET<ResponseDto[]>(`${this.baseUrl}/${this.url}s-list`);
  }

  public async search(params: GetParams): Promise<ResponseDto[]> {
    return await this.GET<ResponseDto[]>(`${this.baseUrl}/${this.url}s/search`, params);
  }

  public async move(moveDto: MoveDto): Promise<ResponseDto[]> {
    return await this.POST<ResponseDto[]>(`${this.baseUrl}/${this.url}s/move`, moveDto);
  }

  public async copy(targetId: number = -1, entityIds: number[]): Promise<ResponseDto[]> {
    return await this.POST<ResponseDto[]>(`${this.baseUrl}/${this.url}s/copy`, {id: targetId, entityIds});
  }

  public async moveToTrash(entityId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/${this.url}/${entityId}/trash`);
  }

  public async moveAllToTrash(entityIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/${this.url}s/trash`, {entityIds});
  }

  public async getTrash(): Promise<ResponseDto[]> {
    return await this.GET<ResponseDto[]>(`${this.baseUrl}/${this.url}s/trash`);
  }

  public async restore(entityId: number): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/${this.url}${entityId}/restore`);
  }

  public async restoreAll(entityIds: number[]): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/${this.url}s/restore`, {entityIds});
  }
}
