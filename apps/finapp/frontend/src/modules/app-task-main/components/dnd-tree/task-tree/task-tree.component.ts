import { Component } from '@angular/core';
import { BaseDataChildrenService } from '../../../services/base-data.service';
import { Router } from '@angular/router';
import { TaskResponseDto } from '@finapp/app-common';
import { IListItem } from '../../list-module/base-list.component';
import { BaseTreeComponent } from '../base-tree.component';


@Component({
  selector: 'app-task-tree',
  templateUrl: 'task-tree.component.html',
  styleUrls: ['task-tree.component.scss'],
  providers: [BaseDataChildrenService]
})
export class TaskTreeComponent extends BaseTreeComponent<IListItem<TaskResponseDto>> {
  constructor(
    _database: BaseDataChildrenService<TaskResponseDto>,
    router: Router,
  ) {
    super(_database, router);
  }
}
