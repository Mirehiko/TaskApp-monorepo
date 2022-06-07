import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import { TaskFilterRequestDto, TaskFilterType } from '@finapp/app-common';
import { User } from '../../common/user/schemas/user.entity';
import { TaskFilterEntity } from './schemas/task-filter.entity';
import { TaskFilterRepository } from './task-filter-repository';


@Injectable()
export class TaskFilterService extends BaseService<TaskFilterEntity, GetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такой роли';

  constructor(
    protected repository: TaskFilterRepository,
  ) {
    super();
  }

  /**
   * Add new task filter
   * @param requestDto
   * @param author
   */
  async createFilter(requestDto: TaskFilterRequestDto, author: User = null): Promise<TaskFilterEntity> {
    const filter = new TaskFilterEntity();

    filter.name = requestDto.name;
    filter.type = requestDto.type || TaskFilterType.CUSTOM;
    filter.metadata = requestDto.metadata || {};
    filter.updatedBy = author;
    filter.createdBy = author;

    const createdFilter = await this.repository.create(filter);
    return await this.repository.save(createdFilter);
  }

  /**
   * Updates filter
   * @param id
   * @param requestDto
   * @param author
   */
  async updateFilter(@Param() id: number, requestDto: TaskFilterRequestDto, author: User = null): Promise<TaskFilterEntity> {
    const filter = await this.repository.findOne({id});
    if (!filter) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    filter.name = requestDto.name || filter.name;
    filter.type = requestDto.type || filter.type;
    filter.metadata = requestDto.metadata || filter.metadata;
    filter.updatedBy = author;

    try {
      return await this.repository.save(filter);
    }
    catch (e) {
      throw new Error(e);
    }
  }
}
