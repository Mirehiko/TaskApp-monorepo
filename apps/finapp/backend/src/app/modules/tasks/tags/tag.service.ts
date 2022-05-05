import { Injectable, Param } from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import { Tag } from './schemas/tag.entity';
import { TagRepository } from './tag-repository';
import { TaskRepository } from '../task/task-repository';
import { TagRequestDto } from '@finapp/app-common';


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

  async create(@Param() requestDto: TagRequestDto): Promise<Tag> {
    const newTag = new Tag();
    newTag.icon = requestDto.icon || '';
    newTag.name = requestDto.name;
    newTag.color = requestDto.color || '';

    // TODO: Set current users as author
    // newTask.createdBy = requestDto.status;
    // newTask.updatedBy = requestDto.status;

    const createdTag = await this.repository.create(newTag);
    return await this.repository.save(createdTag); // 200
  }

  // async update(@Param() id: number, requestDto: TagRequestDto): Promise<Tag> {
  //   return new Tag();
  // }

}
