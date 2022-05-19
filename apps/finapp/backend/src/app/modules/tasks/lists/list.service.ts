import { Injectable, Param } from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import { ListRepository } from './list-repository';
import { TaskTreeRepository } from '../task/task-repository';
import { List } from './schemas/list.entity';


@Injectable()
export class ListService extends BaseService<List, GetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такого счета';
  protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = ['createdBy', 'createdBy.users'];

  constructor(
    protected repository: ListRepository,
    protected taskTreeRepository: TaskTreeRepository,
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
