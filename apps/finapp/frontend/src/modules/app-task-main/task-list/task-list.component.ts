import { Component, OnInit } from '@angular/core';
import { TaskRestService } from '../services/rest/task-rest.service';
import { AuthService } from '../../auth/services/auth.service';
import { SocketNotificationService } from '../services/socket-notification.service';
import { TaskPriority, TaskResponseDto, TaskStatus } from '@finapp/app-common';
import { BaseList, IListConfig } from '../components/list-module/base-list.component';
import { taskListConfig } from './task-tree-config';


@Component({
  selector: 'finapp-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  public tasks: BaseList<TaskResponseDto> = [];
  public taskListConfig = taskListConfig;
  public dataLoaded = false;

  constructor(
    private authService: AuthService,
    private taskRestService: TaskRestService,
    private socketService: SocketNotificationService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.getTasks();
  }

  async getTasks(): Promise<void> {
    this.tasks = await this.taskRestService.getList();
    this.dataLoaded = true;
  }
}
