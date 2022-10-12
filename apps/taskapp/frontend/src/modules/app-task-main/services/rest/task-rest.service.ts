import { Injectable } from "@angular/core";
import {
  IDateRange, ITaskGetParams,
  TaskPriority,
  TaskRequestDto,
  TaskResponseDto,
  TaskStatus
} from '@taskapp/app-common';
import { HttpClient} from '@angular/common/http';
import { BaseTreeEntityRestService } from './base-tree-entity-rest.service';
import { TaskAppModule } from '../../task-app.module';


@Injectable({ providedIn: TaskAppModule })
export class TaskRestService extends BaseTreeEntityRestService<TaskRequestDto, TaskResponseDto, ITaskGetParams> {

  constructor(
    http: HttpClient,
  ) {
    super(http, 'task');
  }

  public async assignTo(taskId: number, assigneeId: number): Promise<TaskResponseDto> {
    return await this.POST<TaskResponseDto>(`${this.baseUrl}${this.url}/${taskId}/assign`, { assigneeId });
  }

  public async setReviewer(taskId: number, reviewerId: number): Promise<TaskResponseDto> {
    return await this.POST<TaskResponseDto>(`${this.baseUrl}${this.url}/${taskId}/reviewer`, { reviewerId });
  }

  public async setStatus(taskId: number, status: TaskStatus): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}${this.url}/${taskId}/status`, { status });
  }

  public async setPriority(taskId: number, priority: TaskPriority): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}${this.url}/${taskId}/priority`, { priority });
  }

  public async setDateDue(taskId: number, dateRange: IDateRange): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}${this.url}/${taskId}/dateDue`, dateRange);
  }

  public async addTaskTags(taskId: number, tagIds: number[]): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}${this.url}/${taskId}/tags`, { tagIds });
  }

  public async removeTaskTags(taskId: number, tagIds: number[]): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}${this.url}/${taskId}/tags`, { tagIds });
  }

  public async addTaskLists(taskId: number, listId: number): Promise<void> {
    return await this.POST<void>(`${this.baseUrl}${this.url}/${taskId}/list`, { listId });
  }

  public async removeTaskLists(taskId: number): Promise<void> {
    return await this.DELETE<void>(`${this.baseUrl}${this.url}/${taskId}/list`);
  }

  public async copy(targetId: number = -1, taskIds: number[]): Promise<TaskResponseDto[]> {
    return await this.POST<TaskResponseDto[]>(`${this.baseUrl}${this.url}s/copy`, {id: targetId, taskIds});
  }
}
