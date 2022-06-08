import { Injectable } from "@angular/core";
import { IDateRange, MoveDto, TaskPriority, TaskRequestDto, TaskResponseDto, TaskStatus } from '@finapp/app-common';
import { HttpClient} from '@angular/common/http';
import { BaseRestService } from './basic-rest.service';
import { TaskGetParams } from '../../../../../../backend/src/app/modules/tasks/task/interfaces/task-params';


@Injectable({ providedIn: "root" })
export class TaskRestService extends BaseRestService {

  constructor(
    http: HttpClient,
  ) {
    super(http);
  }

  public async create(taskRequestDto: TaskRequestDto): Promise<TaskResponseDto> {
    return await this.POST<TaskResponseDto>(`${this.baseUrl}/task`, taskRequestDto);
  }

  public async update(taskId: number, taskRequestDto: TaskRequestDto): Promise<TaskResponseDto> {
    return await this.PATCH<TaskResponseDto>(`${this.baseUrl}/task/${taskId}`, taskRequestDto);
  }

  public async getById(taskId: number): Promise<TaskResponseDto> {
    return await this.GET<TaskResponseDto>(`${this.baseUrl}/task/${taskId}`);
  }

  public async getList(): Promise<TaskResponseDto[]> {
    return await this.GET<TaskResponseDto[]>(`${this.baseUrl}/tasks`);
  }

  public async search(params: TaskGetParams): Promise<TaskResponseDto[]> {
    return await this.GET<TaskResponseDto[]>(`${this.baseUrl}/tasks/search`, params);
  }

  public async assignTo(taskId: number, assigneeId: number): Promise<TaskResponseDto> {
    return await this.POST<TaskResponseDto>(`${this.baseUrl}/task/${taskId}/assign`, { assigneeId });
  }

  public async serReviewer(taskId: number, reviewerId: number): Promise<TaskResponseDto> {
    return await this.POST<TaskResponseDto>(`${this.baseUrl}/task/${taskId}/reviewer`, { reviewerId });
  }

  public async setStatus(taskId: number, status: TaskStatus): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/task/${taskId}/status`, { status });
  }

  public async setPriority(taskId: number, priority: TaskPriority): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/task/${taskId}/priority`, { priority });
  }

  public async setDateDue(taskId: number, dateRange: IDateRange): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/task/${taskId}/dateDue`, dateRange);
  }

  public async move(moveDto: MoveDto): Promise<TaskResponseDto[]> {
    return await this.POST<TaskResponseDto[]>(`${this.baseUrl}/tasks/move`, moveDto);
  }

  public async addTaskTags(taskId: number, tagIds: number[]): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/task/${taskId}/tags`, { tagIds });
  }

  public async removeTaskTags(taskId: number, tagIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/task/${taskId}/tags`, { tagIds });
  }

  public async addTaskLists(taskId: number, listId: number): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/task/${taskId}/list`, { listId });
  }

  public async removeTaskLists(taskId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/task/${taskId}/list`);
  }

  public async copy(targetId: number = -1, taskIds: number[]): Promise<TaskResponseDto[]> {
    return await this.POST<TaskResponseDto[]>(`${this.baseUrl}/tasks/copy`, {id: targetId, taskIds});
  }

  public async deleteTask(taskId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/task${taskId}`);
  }

  public async deleteTasks(taskIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/tasks`, {taskIds});
  }

  public async moveTaskToTrash(taskId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/task/${taskId}/trash`);
  }

  public async moveTasksToTrash(taskIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}/tasks/trash`, {taskIds});
  }

  public async getTaskTrash(): Promise<TaskResponseDto[]> {
    return await this.GET<TaskResponseDto[]>(`${this.baseUrl}/tasks/trash`);
  }

  public async restore(taskId: number): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/task${taskId}/restore`);
  }

  public async restoreTasks(taskIds: number[]): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}/tasks/restore`, {taskIds});
  }

}
