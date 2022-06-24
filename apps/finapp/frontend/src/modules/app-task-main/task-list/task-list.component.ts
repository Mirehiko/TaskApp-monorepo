import { Component, OnInit } from '@angular/core';
import { TaskRestService } from '../services/rest/task-rest.service';
import { AuthService } from '../../auth/services/auth.service';
import { SocketNotificationService } from '../services/socket-notification.service';
import { TaskResponseDto } from '@finapp/app-common';
import {
  BaseGroupList,
  BaseListOfGroup, IActionListItem, ListMenuAction
} from '../components/list-module/base-list.component';
import { taskListConfig } from './task-tree-config';


export class ContextMenu {
  // private _sections
}

enum TaskAction {
  FOCUS = 'focus'
}

const TaskListMenuAction = { ...TaskAction, ...ListMenuAction }
type TaskListMenuAction = TaskAction | ListMenuAction;



@Component({
  selector: 'finapp-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  public taskGroups: BaseGroupList<TaskResponseDto> = new BaseGroupList<TaskResponseDto>(' Tasks');
  public taskListConfig = taskListConfig;
  public dataLoaded = false;
  readonly groupDivider: (data: any[], type: any) => any[];

  public actionList: IActionListItem<TaskListMenuAction>[] = [];

  constructor(
    private authService: AuthService,
    private taskRestService: TaskRestService,
    private socketService: SocketNotificationService,
  ) {
    this.groupDivider = this.taskListConfig.groupDivider ? this.taskListConfig.groupDivider : this.groupDivider;
  }

  async ngOnInit(): Promise<void> {
    await this.getTasks();
    this.actionList = [
      {
        name: 'Create',
        action: TaskListMenuAction.CREATE,
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
        action: TaskListMenuAction.DUPLICATE,
      },
      {
        name: 'Copy link',
        action: TaskListMenuAction.COPY_LINK,
      },
    ];
  }

  async getTasks(): Promise<void> {
    const taskList = await this.taskRestService.getList();
    await this.divideOnGroups(taskList);
    this.dataLoaded = true;
  }

  async divideOnGroups(taskList: TaskResponseDto[]): Promise<void> {
    this.taskGroups.clear();
    if (this.taskListConfig.groups && this.taskListConfig.groups.length && this.taskListConfig.groupDivider) {
      this.taskListConfig.groups.forEach(group => {
        const groupInst = new BaseListOfGroup<TaskResponseDto>(group.name);
        const filteredGroupData = this.groupDivider(taskList, group.type);
        filteredGroupData.map(item => {
          groupInst.insertTo(item);
        });
        this.taskGroups.addGroup(groupInst);
      });
    }
    else {
      const groupInst = new BaseListOfGroup<TaskResponseDto>('');
      taskList.forEach(item => {
        groupInst.insertTo(item);
      });
      this.taskGroups.addGroup(groupInst);
    }
  }
}
