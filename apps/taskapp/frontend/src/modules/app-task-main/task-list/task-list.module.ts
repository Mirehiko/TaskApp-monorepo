import { NgModule } from "@angular/core";
import { TaskListComponent } from './task-list.component';
import { TaskListRoutingModule } from './task-list.routing.module';
import { RouterModule } from '@angular/router';
import { CustomListModule } from '../components/list-module/custom-list.module';
import { DndTreeModule } from '../components/dnd-tree/dnd-tree.module';
import { CommonModule } from '@angular/common';
import { CustomElementsModule } from '../components/custom-elements.module';
import { MatModule } from '../../../app/shared/app-common.module';
import { NavigablePageModule } from '../components/navigable-page/navigable-page.module';
import { NestedListModule } from '../components/nested-list/nested-list.module';


@NgModule({
  declarations: [
    TaskListComponent,
  ],
  imports: [
    CustomListModule,
    CustomElementsModule,
    CommonModule,
    MatModule,
    NavigablePageModule,
    DndTreeModule,
    NestedListModule,
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
