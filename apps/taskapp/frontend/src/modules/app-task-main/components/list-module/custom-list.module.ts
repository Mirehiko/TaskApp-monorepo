import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from './base-list.component';
import { BaseListItemComponent } from './list-items/base-list-item.component';
import { TaskListItemComponent } from './list-items/task-list-item/task-list-item.component';


@NgModule({
  declarations: [
    BaseListComponent,
    BaseListItemComponent,
    TaskListItemComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BaseListComponent,
    TaskListItemComponent,
  ],
})
export class CustomListModule { }
