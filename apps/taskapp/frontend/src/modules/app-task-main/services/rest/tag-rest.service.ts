import { Injectable } from "@angular/core";
import { ITagGetParams, MoveDto, TagRequestDto, TagResponseDto } from '@taskapp/app-common';
import { HttpClient} from '@angular/common/http';
import { BaseRestService } from './basic-rest.service';


@Injectable({ providedIn: "root" })
export class TagRestService extends BaseRestService {

  constructor(
    http: HttpClient,
  ) {
    super(http);
  }

  public async create(tagRequestDto: TagRequestDto): Promise<TagResponseDto> {
    return await this.POST<TagResponseDto>(`${this.baseUrl}/tag`, tagRequestDto);
  }

  public async update(tagId: number, tagRequestDto: TagRequestDto): Promise<TagResponseDto> {
    return await this.PATCH<TagResponseDto>(`${this.baseUrl}/tag/${tagId}`, tagRequestDto);
  }

  public async getById(tagId: number): Promise<TagResponseDto> {
    return await this.GET<TagResponseDto>(`${this.baseUrl}/tag/${tagId}`);
  }

  public async getList(): Promise<TagResponseDto[]> {
    return await this.GET<TagResponseDto[]>(`${this.baseUrl}/tags`);
  }

  public async search(params: ITagGetParams): Promise<TagResponseDto[]> {
    return await this.GET<TagResponseDto[]>(`${this.baseUrl}/tags/search`, params);
  }

  public async move(moveDto: MoveDto): Promise<TagResponseDto[]> {
    return await this.POST<TagResponseDto[]>(`${this.baseUrl}/tags/move`, moveDto);
  }

  public async copy(targetId: number = -1, tagIds: number[]): Promise<TagResponseDto[]> {
    return await this.POST<TagResponseDto[]>(`${this.baseUrl}/tags/copy`, {id: targetId, tagIds});
  }

  public async getTagTrash(): Promise<TagResponseDto[]> {
    return await this.GET<TagResponseDto[]>(`${this.baseUrl}/tags/trash`);
  }

  public async deleteTag(tagId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/tag${tagId}`);
  }

  public async deleteTags(tagIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/tags`, {tagIds});
  }

  public async moveTagToTrash(tagId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/tag/${tagId}/trash`);
  }

  public async moveTagsToTrash(tagIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/tags/trash`, {tagIds});
  }

  public async restore(tagId: number): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/tag${tagId}/restore`);
  }

  public async restoreTags(tagIds: number[]): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/tags/restore`, {tagIds});
  }
}
