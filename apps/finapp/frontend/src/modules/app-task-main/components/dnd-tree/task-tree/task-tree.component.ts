import { Component } from '@angular/core';
import { BaseTreeDatabaseService } from '../../../services/base-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskResponseDto } from '@finapp/app-common';
import { BaseTreeComponent } from '../base-tree.component';


@Component({
  selector: 'app-task-tree',
  templateUrl: 'task-tree.component.html',
  styleUrls: ['task-tree.component.scss'],
  providers: [BaseTreeDatabaseService]
})
export class TaskTreeComponent extends BaseTreeComponent<TaskResponseDto> {
  constructor(
    _database: BaseTreeDatabaseService<TaskResponseDto>,
    router: Router,
    activatedRoute: ActivatedRoute,
  ) {
    super(_database, router, activatedRoute);
  }

}
