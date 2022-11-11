import { BaseRestService } from './basic-rest.service';
import { HttpClient } from '@angular/common/http';


export class BaseEntityRestService<RequestDto, ResponseDto> extends BaseRestService {
  protected readonly url: string = '';

  constructor(
    http: HttpClient,
    url: string
  ) {
    super(http);
    this.url = url;
  }

  public async create(requestDto: RequestDto): Promise<ResponseDto> {
    return await this.POST<ResponseDto>(`${this.baseUrl}/${this.url}`, requestDto);
  }

  public async update(entityId: number, requestDto: RequestDto): Promise<ResponseDto> {
    return await this.PATCH<ResponseDto>(`${this.baseUrl}/${this.url}/${entityId}`, requestDto);
  }

  public async getById(entityId: number): Promise<ResponseDto> {
    return await this.GET<ResponseDto>(`${this.baseUrl}/${this.url}/${entityId}`);
  }

  public async delete(entityId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/${this.url}/${entityId}`);
  }

  public async deleteAll(entityIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/${this.url}s`, {entityIds});
  }
}
