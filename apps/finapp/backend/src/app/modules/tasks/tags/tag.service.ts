import { Injectable, Param } from '@nestjs/common';
import { BaseService, BaseTreeService, GetParamsData } from '../../base-service';
import { Tag } from './schemas/tag.entity';
import { TagTreeRepository } from './tag-repository';
import { TaskTreeRepository } from '../task/task-repository';
import { TagRequestDto } from '@finapp/app-common';


@Injectable()
export class TagService extends BaseTreeService<Tag, GetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такого счета';
  protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = ['createdBy', 'createdBy.users'];

  constructor(
    protected repository: TagTreeRepository,
    protected taskTreeRepository: TaskTreeRepository,
  ) {
    super();
  }



}
