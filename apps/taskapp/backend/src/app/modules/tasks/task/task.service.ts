import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { Task } from './schemas/task.entity';
import {
  IDateRange,
  ITaskGetParams,
  ITaskGetParamsData,
  TaskPriority,
  TaskRequestDto,
  TaskStatus, TreeEntityType
} from '@taskapp/app-common';
import { TaskTreeRepository } from './task-repository';
import { ListRepository } from '../lists/list-repository';
import { UserRepository } from '../../common/user/user-repository';
import { In } from 'typeorm';
import { Tag } from '../tags/schemas/tag.entity';
import { User } from '../../common/user/schemas/user.entity';
import { TagTreeRepository } from '../tags/tag-repository';
import { BaseTreeService } from '../../base-tree-service';


@Injectable()
export class TaskService extends BaseTreeService<Task, ITaskGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой задачи';
	protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = [];

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
   * @param author
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
    newTask.type = requestDto.type || TreeEntityType.DETAIL;

    if (requestDto.assignee) {
      newTask.assignee = await this.userRepository.findOneOrFail({id: requestDto.assignee});
    }
    if (requestDto.reviewer) {
      newTask.reviewer = await this.userRepository.findOneOrFail({id: requestDto.reviewer});
    }
    if (requestDto.tags) {
      newTask.tags = await this.tagTreeRepository.find({id: In(requestDto.tags)});
    }
    if (requestDto.list) {
      newTask.list = await this.listRepository.findOne({id: requestDto.list});
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
   * @param author
   * @param relations
   */
  async update(@Param() id: number, requestDto: TaskRequestDto, author: User = null, relations: string[]): Promise<Task> {
    const task = await this.repository.findOne(id, { relations });
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
    task.type = requestDto.type || task.type;

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
    const task = await this.repository.findOne(id, {relations: ['tags']});
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    const tags = await this.tagTreeRepository.find({id: In(tagIds)});
    if (!tags.length) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    const tagList = task.tags.length ? [...task.tags, ...tags.filter(t => !task.tags.map(tt => tt.id).includes(t.id))] : tags;
    task.tags = tagList;
    await this.repository.save(task);
    return tagList;
  }

  /**
   * Remove tags from task
   * @param id
   * @param tagIds
   */
  async removeTags(id: number, tagIds: number[]): Promise<any> {
    const task = await this.repository.findOne(id, {relations: ["tags"]});
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    const tags = await this.tagTreeRepository.find({id: In(tagIds)});
    if (!tags.length) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    if (!task.tags?.length) {
      return;
    }
    task.tags = task.tags.filter(tt => !tagIds.includes(tt.id));
    await this.repository.save(task);
  }

  /**
   * Add task to lists
   * @param id
   * @param listId
   */
  async addLists(id: number, listId: number): Promise<Task> {
    const task = await this.repository.findOne(id, {relations: ['list']});
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    const list = await this.listRepository.findOne(listId);
    if (!list) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    task.list = list;
    await this.repository.save(task);
    return task;
  }

  /**
   * Remove task from lists
   * @param id
   */
  async removeLists(id: number): Promise<any> {
    const task = await this.repository.findOne(id, {relations: ['list']});
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    task.list = null;
    await this.repository.save(task);
    return task;
  }

  /**
   * Set/unset reviewer for the task
   * @param id
   * @param reviewerId
   * @param editor
   * @param relations
   */
  async setReviewer(id: number, reviewerId: number | null, editor: User, relations: string[]): Promise<Task> {
    const task = await this.repository.findOne(id, { relations });
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
   * @param assignTo
   * @param editor
   * @param relations
   */
  async assignTaskTo(id: number, assignTo: number | null, editor: User, relations: string[]): Promise<Task> {
    const task = await this.repository.findOne(id, { relations });
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
   * Set start and end for the task
   * @param id
   * @param dateDue
   * @param editor
   */
  async setDateDue(id: number, dateDue: IDateRange, editor: User): Promise<Task> {
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

    const statusForUpdate = [TaskStatus.PENDING, TaskStatus.DONE, TaskStatus.WONT_DO];
    if (statusForUpdate.includes(status)) {
      await this.updateStatuses(entity);
    }

    // TODO: calculate status for parent tasks;
    return await this.repository.save(entity);
  }

  /**
   * Search tasks
   * @param paramsData
   * @param relations
   */
  async searchTasksBy(paramsData: ITaskGetParams, relations: string[] = []): Promise<Task[]> {
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
    if (paramsData.list) {
      qb.andWhere('tasks.list = :list)', {list: paramsData.list});
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

  async updateStatuses(task: Task): Promise<void> {
    const children = await this.repository.findDescendantsTree(task);
    await this.updateCurrentStatusForChildren([children], task);

    const parentTree = await this.repository.findAncestorsTree(task);
    await this.updateCurrentStatusForParents(parentTree.parent, task);
  }

  async updateCurrentStatusForParents(parent: Task, task: Task): Promise<void> {
    const children = await this.repository.findDescendantsTree(parent, {depth: 1});
    const ignoreStatus = [TaskStatus.DRAFT, TaskStatus.BACKLOG];
    const calculable = children.children.filter(t => !ignoreStatus.includes(t.status)).length;
    const matches = children.children.filter(t => t.status === task.status).length;
    if (calculable !== matches) {
      return;
    }

    if (parent.status !== TaskStatus.DRAFT) {
      parent.status = task.status;
      parent.updatedBy = task.updatedBy;
      // await this.repository.update(parent.id, {status: task.status, updatedBy: task.updatedBy})
      await this.repository.save(parent);
    }

    if (parent.parent) {
      await this.updateCurrentStatusForParents(parent.parent, parent);
    }
  }

  async updateCurrentStatusForChildren(taskTree: Task[], parent: Task): Promise<void> {
    await Promise.all(taskTree.map(async (task: Task) => {
      if (task.status !== TaskStatus.DRAFT) {
        task.status = parent.status;
        task.updatedBy = parent.updatedBy;
        await this.repository.save(task);
      }

      if (task.children.length) {
        await this.updateCurrentStatusForChildren(task.children, task);
      }
    }));
  }

  // TODO: Пересчитывать ли статус родительских задач при перемещении/добавлении/удалении
  // TODO: Хранить ли статусы подзадач в задаче?

}


