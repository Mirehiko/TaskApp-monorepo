import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseTreeService } from '../../base-service';
import { TaskGetParams, TaskGetParamsData } from './interfaces/task-params';
import { Task } from './schemas/task.entity';
import { MoveDto, TaskDateDueDto, TaskPriority, TaskRequestDto, TaskStatus } from '@finapp/app-common';
import { TaskTreeRepository } from './task-repository';
import { ListRepository } from '../lists/list-repository';
import { UserRepository } from '../../common/user/user-repository';
import { In, IsNull, Not } from 'typeorm';
import { Tag } from '../tags/schemas/tag.entity';
import { User } from '../../common/user/schemas/user.entity';
import { TagTreeRepository } from '../tags/tag-repository';


@Injectable()
export class TaskService extends BaseTreeService<Task, TaskGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой задачи';
	protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = ['parent', 'children', 'createdBy', 'updatedBy', 'assignee', 'reviewer'];

	constructor(
    protected listRepository: ListRepository,
    protected tagTreeRepository: TagTreeRepository,
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
      newTask.tags = await this.tagTreeRepository.find({id: In(requestDto.tags)});
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

    let candidate = null;
    if (reviewerId !== null) {
      candidate = await this.userRepository.findOne(reviewerId);
      if (!candidate) {
        throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
      }
    }

    task.reviewer = candidate;
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

    let candidate = null;
    if (assignTo !== null) {
      candidate = await this.userRepository.findOne(assignTo);
      if (!candidate) {
        throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
      }
    }

    task.assignee = candidate;
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
    await this.repository.moveTo(parent, moveDto, author)
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

  /**
   * Get tasks from trash
   */
  async getTaskTrash(): Promise<Task[]> {
    return await this.repository.find({withDeleted: true, where: {deletedAt: Not(IsNull())}});
  }

  /**
   * Search tasks
   * @param paramsData
   */
  async searchTasksBy(paramsData: TaskGetParams): Promise<Task[]> {
    const qb = this.repository.createQueryBuilder('tasks')
      .where("CONCAT(tasks.name, ' ', tasks.description) LIKE :text", { text: `%${paramsData.name || ''}%` });

    if (paramsData.priority) {
      qb.andWhere('tasks.priority IN (:priorities)', {priorities: paramsData.priority});
    }
    if (paramsData.status) {
      qb.andWhere('tasks.status IN (:statuses)', {statuses: paramsData.status});
    }
    if (paramsData.assignee) {
      qb.andWhere('tasks.assignee IN (:assigneeIds)', {assigneeIds: paramsData.assignee});
    }
    if (paramsData.reviewer) {
      qb.andWhere('tasks.reviewer IN (:reviewerIds)', {reviewerIds: paramsData.reviewer});
    }
    if (paramsData.createdBy) {
      qb.andWhere('tasks.createdById IN (:createdByIds)', {createdByIds: paramsData.createdBy});
    }
    if (paramsData.tags) {
      qb.andWhere('tasks.tags IN (:tagsIds)', {tagsIds: paramsData.tags});
    }
    if (paramsData.lists) {
      qb.andWhere('tasks.lists IN (:listsIds)', {listsIds: paramsData.lists});
    }
    if (paramsData.createdAt) {
      qb.andWhere('tasks.createdAt BETWEEN :startDate AND :endDate', {
        startDate: paramsData.createdAt.startDate,
        endDate: paramsData.createdAt.endDate
      });
    }
    if (paramsData.dateDue) {
      qb.andWhere('tasks.endDate BETWEEN :startDate AND :endDate', {
        startDate: paramsData.dateDue.startDate,
        endDate: paramsData.dateDue.endDate
      });
    }
    if (paramsData.withDeleted) {
      qb.withDeleted();
    }

    return await qb.getMany();
  }

  /**
   * Move tasks to trash
   * @param ids
   */
  async moveTasksToTrash(ids: number[]): Promise<any> {
    const entities = await this.repository.find({where: {id: In(ids)}});
    if (!entities.length) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    try {
      await this.repository.softDelete(ids);
      return {status: HttpStatus.OK, statusText: 'Moved to trash successfully'};
    }
    catch (e) {
      throw new Error(e);
    }
  }

  copyEntity(entity: Task): Task {
    const task = new Task();
    for(const k in task) task[k] = entity[k];
    return task;
  }
}


