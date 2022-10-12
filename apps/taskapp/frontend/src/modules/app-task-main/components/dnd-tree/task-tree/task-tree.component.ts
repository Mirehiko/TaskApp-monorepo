import { Component, Injectable } from '@angular/core';
import { BaseTreeDatabaseService } from '../../../services/base-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITaskGetParams, TaskRequestDto, TaskResponseDto } from '@taskapp/app-common';
import { BaseTreeComponent } from '../base-tree.component';
import { TaskRestService } from '../../../services/rest/task-rest.service';
import { ITreeItem } from '../../list-module/base-list.component';
import { TaskTreeHelper } from '../../../helpers/task-helpers';


@Injectable()
export class TaskTreeDatabaseService extends BaseTreeDatabaseService<TaskRequestDto, TaskResponseDto, ITaskGetParams> {
  constructor(
    rest: TaskRestService
  ) {
    super(rest);
  }

  public async restUpdate(item: ITreeItem<TaskResponseDto>, name: string): Promise<void> {
    await this.rest.update(item.id, {name});
  }

  public async restInsert(items: ITreeItem<TaskResponseDto>[], parentId: number = -1): Promise<ITreeItem<TaskResponseDto>[]> {
    const tasks: TaskResponseDto[] = [];
    await Promise.all(items.map(async (item) => {
      item.parent_id = parentId;
      const task = await this.rest.create(item as TaskRequestDto);
      tasks.push(task)
    }));
    return await TaskTreeHelper.mapDtoToTree(tasks);
  }
}

@Component({
  selector: 'app-task-tree',
  templateUrl: 'task-tree.component.html',
  styleUrls: ['task-tree.component.scss'],
  providers: [TaskTreeDatabaseService]
})
export class TaskTreeComponent extends BaseTreeComponent<TaskRequestDto, TaskResponseDto, ITaskGetParams> {
  constructor(
    _database: TaskTreeDatabaseService,
    router: Router,
    activatedRoute: ActivatedRoute,
    rest: TaskRestService
  ) {
    super(_database, router, activatedRoute);
    // this.rest = rest;
  }
}
