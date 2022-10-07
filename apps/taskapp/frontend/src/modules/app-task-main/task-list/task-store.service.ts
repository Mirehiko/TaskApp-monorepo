import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ListResponseDto, TagResponseDto, TaskResponseDto } from '@taskapp/app-common';
import { TagRestService } from '../services/rest/tag-rest.service';
import { ListRestService } from '../services/rest/list-rest.service';
import { Subject } from 'rxjs';
import { TaskRestService } from '../services/rest/task-rest.service';


@Injectable({providedIn: 'root'})
export class TaskStoreService {
  public tasks: TaskResponseDto[] = [];
  public $tasks: Subject<TaskResponseDto[]> = new Subject();
  public selectedTasks: number[] = [];

  constructor(
    private taskRestService: TaskRestService,
    private router: Router,
  ) {
    this.initialize();
  }

  async initialize(): Promise<void> {
  }

  async getTasksTree(): Promise<TaskResponseDto[]> {
    this.tasks = await this.taskRestService.getTree();
    this.$tasks.next(this.tasks);
    return this.tasks;
  }

  async getTasksByTags(ids: number[]): Promise<TaskResponseDto[]> {
    this.$tasks.next(this.tasks);
    return this.tasks;
  }
}
