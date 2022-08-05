import { Injectable } from "@angular/core";
import { IListGetParams, ListRequestDto, ListResponseDto, MoveDto } from '@taskapp/app-common';
import { HttpClient} from '@angular/common/http';
import { BaseRestService } from './basic-rest.service';


@Injectable({ providedIn: "root" })
export class ListRestService extends BaseRestService {

  constructor(
    http: HttpClient,
  ) {
    super(http);
  }

  public async create(listRequestDto: ListRequestDto): Promise<ListResponseDto> {
    return await this.POST<ListResponseDto>(`${this.baseUrl}/list`, listRequestDto);
  }

  public async update(listId: number, listRequestDto: ListRequestDto): Promise<ListResponseDto> {
    return await this.PATCH<ListResponseDto>(`${this.baseUrl}/list/${listId}`, listRequestDto);
  }

  public async getById(listId: number): Promise<ListResponseDto> {
    return await this.GET<ListResponseDto>(`${this.baseUrl}/list/${listId}`);
  }

  public async getList(): Promise<ListResponseDto[]> {
    return await this.GET<ListResponseDto[]>(`${this.baseUrl}/lists`);
  }

  public async search(params: IListGetParams): Promise<ListResponseDto[]> {
    return await this.GET<ListResponseDto[]>(`${this.baseUrl}/lists/search`, params);
  }

  public async move(moveDto: MoveDto): Promise<ListResponseDto[]> {
    return await this.POST<ListResponseDto[]>(`${this.baseUrl}/lists/move`, moveDto);
  }

  public async copy(id: number): Promise<ListResponseDto[]> {
    return await this.POST<ListResponseDto[]>(`${this.baseUrl}/lists/copy`, {id});
  }

  public async getListTrash(): Promise<ListResponseDto[]> {
    return await this.GET<ListResponseDto[]>(`${this.baseUrl}/lists/trash`);
  }

  public async deleteList(listId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/list${listId}`);
  }

  public async deleteLists(listIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/lists`, {listIds});
  }

  public async moveListToTrash(listId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/list/${listId}/trash`);
  }

  public async moveListsToTrash(listIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/lists/trash`, {listIds});
  }

  public async restore(listId: number): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/list${listId}/restore`);
  }

  public async restoreLists(listIds: number[]): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/lists/restore`, {listIds});
  }
}
