import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseTreeService } from '../../base-service';
import { TaskGetParamsData } from './interfaces/task-params';
import { Task } from './schemas/task.entity';
import { MoveDto, TaskDateDueDto, TaskPriority, TaskRequestDto, TaskStatus } from '@finapp/app-common';
import { TaskTreeRepository } from './task-repository';
import { TagRepository } from '../tags/tag-repository';
import { ListRepository } from '../lists/list-repository';
import { UserRepository } from '../../common/user/user-repository';
import { In } from 'typeorm';
import { Tag } from '../tags/schemas/tag.entity';
import { User } from '../../common/user/schemas/user.entity';


@Injectable()
export class TaskService extends BaseTreeService<Task, TaskGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой задачи';
	protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = ['parent', 'children', 'createdBy', 'updatedBy', 'assignee', 'reviewer'];

	constructor(
    protected listRepository: ListRepository,
    protected tagRepository: TagRepository,
    protected userRepository: UserRepository,
    protected repository: TaskTreeRepository
	) {
		super();
	}

  /**
   * Create new node. If a parent task defined the task will be subtask of this parent task
   * @param requestDto
   */
  public async createTree(@Param() requestDto: TaskRequestDto, author: User = null): Promise<Task> {
    const newTask = new Task();
    newTask.description = requestDto.description || '';
    newTask.icon = requestDto.icon || '';
    newTask.name = requestDto.name;
    newTask.status = requestDto.status || TaskStatus.DRAFT;
    newTask.parent_id = requestDto.parent_id || newTask.parent_id;
    newTask.priority = requestDto.priority || TaskPriority.NONE;
    newTask.startDate = requestDto.startDate || null;
    newTask.endDate = requestDto.endDate || null;

    if (requestDto.assignee) {
      newTask.assignee = await this.userRepository.findOneOrFail({id: requestDto.assignee});
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

    newTask.createdBy = author;
    newTask.updatedBy = author;

    if (requestDto.parent_id !== -1) {
      newTask.parent = await this.repository.findOne({where: {id: requestDto.parent_id}});
      return await this.repository.save(newTask);
    }
    const createdTask = await this.repository.create(newTask);
    return await this.repository.save(createdTask); // 200
  }

  /**
   * Update task data
   * @param id
   * @param requestDto
   */
  async update(@Param() id: number, requestDto: TaskRequestDto, author: User = null): Promise<Task> {
    const task = await this.repository.findOne(id);
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    task.description = requestDto.description || requestDto.description;
    task.name = requestDto.name || task.name;
    task.icon = requestDto.icon || task.icon;
    task.status = requestDto.status || task.status || TaskStatus.DRAFT;
    task.priority = requestDto.priority || TaskPriority.NONE;
    task.startDate = requestDto.startDate || null;
    task.endDate = requestDto.endDate || null;
    task.updatedBy = author;

    try {
      return await this.repository.save(task);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Add tags to current task
    * @param id
   * @param tagIds
   */
  async addTags(id: number, tagIds: number[]): Promise<Tag[]> {
	  return [];
  }

  /**
   * Remove tags from task
   * @param id
   * @param tagIds
   */
  async removeTags(id: number, tagIds: number[]): Promise<any> {
    return;
  }

  /**
   * Add task to lists
   * @param id
   * @param listIds
   */
  async addLists(id: number, listIds: number[]): Promise<Tag[]> {
    return [];
  }

  /**
   * Remove task from lists
   * @param id
   * @param listIds
   */
  async removeLists(id: number, listIds: number[]): Promise<any> {
    return;
  }

  /**
   * Set/unset reviewer for the task
   * @param id
   * @param tagIds
   */
  async setReviewer(id: number, reviewerId: number | null, editor: User): Promise<Task> {
    const task = await this.repository.findOne(id);
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    const candidate = await this.userRepository.findOne(reviewerId);
    if (!candidate) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    task.reviewer = candidate.id !== editor.id ? candidate : null;
    task.updatedBy = editor;

    try {
      return await this.repository.save(task);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Set/unset responsible for the task
   * @param id
   * @param tagIds
   */
  async assignTaskTo(id: number, assignTo: number | null, editor: User): Promise<Task> {
    const task = await this.repository.findOne(id);
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    const candidate = await this.userRepository.findOne(assignTo);
    if (!candidate) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    task.assignee = candidate.id !== editor.id ? candidate : null;
    task.updatedBy = editor;

    try {
      return await this.repository.save(task);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Move selected tasks to the task
   * @param moveDto
   */
  async moveTasksTo(moveDto: MoveDto, author: User = null): Promise<void> {
    const parent = await this.repository.findOne(moveDto.parentId);
    if (!parent) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    let children = await this.repository.find({ where: { id: In(moveDto.childIds) } });
    children = children.map(child => {
      child.parent = parent;
      child.parent_id = parent.id;
      child.updatedBy = author;
      return child;
    })
    await this.repository.save(children);
  }

  async deleteMultiple(ids: number): Promise<any> {

  }

  /**
   * Get the task
   * @param id
   */
  public async getTreeByID(id: number): Promise<Task> {
    const entity = await this.repository.findOne({where: {id}, relations: ['assignee', 'reviewer', 'createdBy']});
    if (entity) {
      await this.repository.findDescendantsTree(entity, {depth: 2 });
      return entity;
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
  }

  /**
   * Delete task with subtasks
   * @param id
   */
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

  /**
   * Set start and end for the task
   * @param id
   * @param dateDue
   * @param editor
   */
  async setDateDue(id: number, dateDue: TaskDateDueDto, editor: User): Promise<Task> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    // TODO: Add timezone calculations
    entity.startDate = dateDue.startDate || null;
    entity.endDate = dateDue.endDate || null;
    entity.updatedBy = editor;

    return await this.repository.save(entity);
  }

  /**
   * Change the task priority
   * @param id
   * @param priority
   * @param editor
   */
  async setPriority(id: number, priority: TaskPriority, editor: User): Promise<any> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    entity.priority = priority;
    entity.updatedBy = editor;
    await this.repository.save(entity);
  }

  /**
   * Change the task status
   * @param id
   * @param status
   * @param editor
   */
  async setStatus(id: number, status: TaskStatus, editor: User): Promise<Task> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    entity.status = status;
    entity.updatedBy = editor;

    // TODO: calculate status for parent tasks;
    return await this.repository.save(entity);
  }

  async getTasksBy(): Promise<Task[]> {
    return [];
  }
}


