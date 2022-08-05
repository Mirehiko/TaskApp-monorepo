import { Component } from '@angular/core';
import { BaseListItemComponent } from '../base-list-item.component';
import { TaskResponseDto } from '@taskapp/app-common';


@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['task-list-item.component.scss']
})
export class TaskListItemComponent extends BaseListItemComponent<TaskResponseDto> {
}
