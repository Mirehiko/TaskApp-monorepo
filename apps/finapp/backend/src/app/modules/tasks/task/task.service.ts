import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseTreeService } from '../../base-service';
import { TaskGetParamsData } from './interfaces/task-params';
import { Task } from './schemas/task.entity';
import { TaskRequestDto, TaskStates } from '@finapp/app-common';
import { TaskTreeRepository } from './task-repository';
import { TagRepository } from '../tags/tag-repository';
import { ListRepository } from '../lists/list-repository';
import { UserRepository } from '../../common/user/user-repository';
import { In } from 'typeorm';
import { Tag } from '../tags/schemas/tag.entity';


@Injectable()
export class TaskService extends BaseTreeService<Task, TaskGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой задачи';
	protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = ['parent', 'children'];

	constructor(
    protected listRepository: ListRepository,
    protected tagRepository: TagRepository,
    protected userRepository: UserRepository,
    protected repository: TaskTreeRepository
	) {
		super();
	}

  public async createTree(@Param() requestDto: TaskRequestDto): Promise<Task> {
    const newTask = new Task();
    newTask.dateDue = requestDto.dateDue;
    newTask.description = requestDto.description;
    newTask.icon = requestDto.icon;
    newTask.name = requestDto.name;
    newTask.status = requestDto.status || TaskStates.DRAFT;
    newTask.parent_id = requestDto.parent_id || newTask.parent_id;

    if (requestDto.assignee) {
      newTask.assignee = await this.userRepository.find({id: In(requestDto.assignee)});
    }
    if (requestDto.reviewer) {
      newTask.reviewer = await this.userRepository.findOneOrFail({id: requestDto.reviewer});
    }
    if (requestDto.tags) {
      newTask.tags = await this.tagRepository.find({id: In(requestDto.tags)});
    }
    if (requestDto.lists) {
      newTask.lists = await this.listRepository.find({id: In(requestDto.lists)});
    }

    // TODO: Set current users as author
    if (requestDto.parent_id !== -1) {
      newTask.parent = await this.repository.findOne({where: {id: requestDto.parent_id}});
      return await this.repository.save(newTask);
    }
    const createdTask = await this.repository.create(newTask);
    return await this.repository.save(createdTask); // 200
  }

  async update(@Param() id: number, requestDto: TaskRequestDto): Promise<Task> {
    const task = await this.repository.findOne(id);
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    task.description = requestDto.description || requestDto.description;
    task.name = requestDto.name || task.name;
    task.icon = requestDto.icon || task.icon;
    task.dateDue = requestDto.dateDue || task.dateDue;
    task.status = requestDto.status || task.status || TaskStates.DRAFT;

    try {
      return await this.repository.save(task);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  async addTags(): Promise<Tag[]> {
	  return [];
  }

  async removeTags(): Promise<any> {
    return;
  }

  async addLists(): Promise<Tag[]> {
    return [];
  }

  async removeLists(): Promise<any> {
    return;
  }

  async setReviewer(): Promise<void> {
  }

  async unsetReviewer(): Promise<void> {
  }

  async assignTaskTo(): Promise<any> {
    return;
  }

  async unAssignTask(): Promise<any> {
    return;
  }

  async moveTasksTo(id: number, ids: number[]): Promise<void> {

  }

  async deleteMultiple(ids: number): Promise<any> {

  }

  public async getTreeByID(id: number): Promise<Task> {
    const entity = await this.repository.findOne({where: {id}});
    if (entity) {
      await this.repository.findDescendantsTree(entity, {depth: 2 });
      return entity;
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
  }


  async delete(@Param() id: number): Promise<any> {
    const entity = await this.repository.findOne({where: {id}});
    if (!entity) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    try {
      await this.repository.remove(entity);
      return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
    }
    catch (e) {
      throw new Error(e);
    }
  }
}


