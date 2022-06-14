import { Component, OnInit } from '@angular/core';
import { TaskRestService } from '../services/rest/task-rest.service';
import { AuthService } from '../../auth/services/auth.service';
import { SocketNotificationService } from '../services/socket-notification.service';
import { TaskPriority, TaskResponseDto, TaskStatus } from '@finapp/app-common';
import { IListConfig } from '../components/list-module/base-list.component';


enum AdditionTaskGroups {
  FINISHED = 'finished',
}

type TaskGroupsByPriority = TaskPriority | AdditionTaskGroups;
const TaskGroupsByPriority = { ...TaskPriority, ...AdditionTaskGroups };

const taskListConfig: IListConfig = {
  groups: [{
    name: 'High',
    type: TaskPriority.HIGH
  },
  {
    name: 'Medium',
    type: TaskPriority.MEDIUM
  },
  {
    name: 'Low',
    type: TaskPriority.LOW
  },
  {
    name: 'None',
    type: TaskPriority.NONE
  }],
  groupDivider(list: TaskResponseDto[], priority: TaskGroupsByPriority): TaskResponseDto[] {
    return list.filter(task => {
      switch (priority) {
        case TaskGroupsByPriority.FINISHED:
          return [TaskStatus.DONE, TaskStatus.WONT_DO].includes(task.status);
        default:
          return task.priority === priority;
        }
    });
  },
  pinnable: true,
  listDescription: [{
    field: 'name',
  },
    {
    field: 'createdAt',
  }]
}

@Component({
  selector: 'finapp-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  public tasks: TaskResponseDto[] = [];
  public taskListConfig = taskListConfig;

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
  }
}
