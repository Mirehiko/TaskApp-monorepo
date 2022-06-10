import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService } from '../../base-service';
import { IGetParamsData, ITaskFilterParams, TaskFilterRequestDto, TaskFilterType } from '@finapp/app-common';
import { User } from '../../common/user/schemas/user.entity';
import { TaskFilterEntity } from './schemas/task-filter.entity';
import { TaskFilterRepository } from './task-filter-repository';
import { TaskFilterMetadataRepository } from './task-filter-metadata.repository';
import { TaskFilterMetadataEntity } from './schemas/task-filter-metadata.entity';
import { UserRepository } from '../../common/user/user-repository';
import { TagTreeRepository } from '../tags/tag-repository';
import { ListRepository } from '../lists/list-repository';
import { In } from 'typeorm';


@Injectable()
export class TaskFilterService extends BaseService<TaskFilterEntity, IGetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такой роли';

  constructor(
    protected repository: TaskFilterRepository,
    protected metadataRepository: TaskFilterMetadataRepository,
    protected userRepository: UserRepository,
    protected tagRepository: TagTreeRepository,
    protected listRepository: ListRepository,
  ) {
    super();
  }

  async getByID(id: number, relations: string[] = []): Promise<TaskFilterEntity> {
    const filter = await this.repository.findOne(id, { relations });
    if (!filter) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    return filter;
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
    filter.updatedBy = author;
    filter.createdBy = author;

    let metadata = new TaskFilterMetadataEntity();
    metadata = await this.setMetadata(metadata, requestDto.metadata);

    const createdMetadata = await this.metadataRepository.create(metadata);
    filter.metadata = createdMetadata;
    await this.metadataRepository.save(createdMetadata);

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
    const filter = await this.repository.findOne(id, {relations: ['metadata', 'metadata.createdBy', 'metadata.updatedBy',
        'metadata.assignee', 'metadata.reviewer', 'metadata.tags', 'metadata.list']});
    if (!filter) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    filter.name = requestDto.name || filter.name;
    filter.type = requestDto.type || filter.type;

    if (filter.metadata) {
      filter.metadata = await this.setMetadata(filter.metadata, requestDto.metadata);
      await this.metadataRepository.save(filter.metadata);
    }

    try {
      return await this.repository.save(filter);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  async setMetadata(metadata: TaskFilterMetadataEntity, upd: ITaskFilterParams): Promise<TaskFilterMetadataEntity> {
    if (!upd) {
      return metadata;
    }

    metadata.name = upd.name || metadata.name;
    metadata.pinned = upd.pinned || metadata.pinned;
    metadata.dates = upd.dates || metadata.dates;
    metadata.status = upd.status || metadata.status;

    if (upd.assignee) {
      metadata.assignee = await this.userRepository.find({id: In(upd.assignee)});
    }

    if (upd.reviewer) {
      metadata.reviewer = await this.userRepository.find({id: In(upd.reviewer)});
    }

    if (upd.createdBy) {
      metadata.createdBy = await this.userRepository.find({id: In(upd.createdBy)});
    }

    if (upd.updatedBy) {
      metadata.updatedBy = await this.userRepository.find({id: In(upd.updatedBy)});
    }

    if (upd.list) {
      metadata.list = await this.listRepository.find({id: In(upd.list)});
    }

    if (upd.tags) {
      metadata.tags = await this.listRepository.find({id: In(upd.tags)});
    }
    return metadata;
  }
}
