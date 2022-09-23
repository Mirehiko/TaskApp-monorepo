import { Component, OnInit } from '@angular/core';
import { TaskRestService } from '../services/rest/task-rest.service';
import { AuthService } from '../../auth/services/auth.service';
import { SocketNotificationService } from '../services/socket-notification.service';
import { ListResponseDto, TagResponseDto, TaskResponseDto } from '@taskapp/app-common';
import {
  IActionListItem,
  IListItemAction,
  ITreeItem,
} from '../components/list-module/base-list.component';
import { taskListConfig } from './task-tree-config';
import { TaskListMenuAction } from '../task-common/task-common';
import { TaskTreeHelper } from '../helpers/task-helpers';
import { NavigableTaskPageService } from './navigable-task-page.service';


export class ContextMenu {
  // private _sections
}


@Component({
  selector: 'taskapp-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  public taskListConfig = taskListConfig;
  public dataLoaded = false;
  public tasks: ITreeItem<TaskResponseDto>[] = [];
  public tags: TagResponseDto[] = [];
  public lists: ListResponseDto[] = [];
  public menuItems: IActionListItem<TaskListMenuAction>[] = [];

  constructor(
    private authService: AuthService,
    private taskRestService: TaskRestService,
    private socketService: SocketNotificationService,
    private navigableTaskService: NavigableTaskPageService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.getTasks();
    this.menuItems = [
      {
        name: 'Create child',
        action: TaskListMenuAction.ADD_CHILD,
      },
      {
        name: 'Delete',
        action: TaskListMenuAction.DELETE,
      },
      {
        name: 'Pin',
        action: TaskListMenuAction.PIN,
      },
      {
        name: 'Move',
        action: TaskListMenuAction.MOVE,
      },
      {
        name: 'Duplicate',
        action: TaskListMenuAction.COPY,
      },
      {
        name: 'Focus',
        action: TaskListMenuAction.FOCUS,
      },
      {
        name: 'Copy link',
        action: TaskListMenuAction.COPY_LINK,
      },
    ];
    this.tags = this.navigableTaskService.tags;
    this.lists = this.navigableTaskService.lists;
    this.navigableTaskService.$tags.subscribe(data => this.tags = data);
    this.navigableTaskService.$lists.subscribe(data => this.lists = data);
  }

  async getTasks(): Promise<void> {
    const tasks = await this.taskRestService.getTree();
    this.tasks = await TaskTreeHelper.mapDtoToTree(tasks);
    this.dataLoaded = true;
  }

  public onMenuAction(action: IListItemAction): void {
    console.log(action)
  }
}
