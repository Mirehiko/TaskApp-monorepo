import { NgModule } from "@angular/core";
import { TaskListComponent } from './task-list.component';
import { TaskListRoutingModule } from './task-list.routing.module';
import { RouterModule } from '@angular/router';
import { CustomListModule } from '../components/list-module/custom-list.module';
import { DndTreeModule } from '../components/dnd-tree/dnd-tree.module';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    TaskListComponent,
  ],
  imports: [
    CustomListModule,
    CommonModule,
    DndTreeModule,
    RouterModule.forChild([
      {
        path: "",
        component: TaskListComponent
      }
    ]),
    TaskListRoutingModule,
  ],
  entryComponents: [
    TaskListComponent
  ],
  exports: [
  ]
})
export class TaskListModule {
}
