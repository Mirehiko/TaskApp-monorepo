import { Injectable, Param } from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import { Tag } from './schemas/tag.entity';
import { TagRepository } from './tag-repository';
import { TaskRepository } from '../task/task-repository';
import { ListRepository } from '../lists/list-repository';


@Injectable()
export class TagService extends BaseService<Tag, GetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такого счета';
  protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = ['createdBy', 'createdBy.users'];

  constructor(
    protected repository: TagRepository,
    protected taskRepository: TaskRepository,
  ) {
    super();
  }

  // async create(@Param() requestDto: TagRequestDto): Promise<Tag> {
  //   return new Tag();
  // }
  //
  // async update(@Param() id: number, requestDto: TagRequestDto): Promise<Tag> {
  //   return new Tag();
  // }

}
