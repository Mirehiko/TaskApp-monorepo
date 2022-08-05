import { Component, OnInit } from '@angular/core';
import { TaskRestService } from '../services/rest/task-rest.service';
import { AuthService } from '../../auth/services/auth.service';
import { SocketNotificationService } from '../services/socket-notification.service';
import { TaskResponseDto } from '@taskapp/app-common';
import {
  IActionListItem,
  IListItemAction,
  ITreeItem,
  ListItemOption,
} from '../components/list-module/base-list.component';
import { taskListConfig } from './task-tree-config';


export class ContextMenu {
  // private _sections
}

enum TaskAction {
  FOCUS = 'focus',
  CONVERT_TO_TEXT = 'convertToText',
  CONVERT_TO_TASK = 'convertToTask',
}

const TaskListMenuAction = { ...TaskAction, ...ListItemOption };
type TaskListMenuAction = TaskAction | ListItemOption;



@Component({
  selector: 'taskapp-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  public taskListConfig = taskListConfig;
  public dataLoaded = false;
  public tasks: ITreeItem<TaskResponseDto>[] = [];

  public menuItems: IActionListItem<TaskListMenuAction>[] = [];

  constructor(
    private authService: AuthService,
    private taskRestService: TaskRestService,
    private socketService: SocketNotificationService,
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
  }

  async getTasks(): Promise<void> {
    const tasks = await this.taskRestService.getList();
    this.tasks = await this.mapItems(tasks);
    this.dataLoaded = true;
  }
  private async mapItems(items: TaskResponseDto[]): Promise<ITreeItem<TaskResponseDto>[]> {
    return items.map(i => this.mapDtoToTree(i));
  }

  private mapDtoToTree(item: TaskResponseDto): ITreeItem<TaskResponseDto> {
    const dataItem: ITreeItem<TaskResponseDto> = {
      id: item.id,
      data: item,
      children: [],
      isGroup: false,
    };
    if (item?.pinned) {
      dataItem.pinned = item.pinned;
    }
    if (item.children?.length) {
      item.children.forEach((child: TaskResponseDto) => {
        dataItem.children.push(this.mapDtoToTree(child));
      });
    }
    return dataItem;
  }


  public onMenuAction(action: IListItemAction): void {
    console.log(action)
  }
}
