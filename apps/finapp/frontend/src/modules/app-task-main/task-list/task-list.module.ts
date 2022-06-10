import { NgModule } from "@angular/core";
import { TaskListComponent } from './task-list.component';
import { TaskListRoutingModule } from './task-list.routing.module';
import { RouterModule } from '@angular/router';
import { CustomListModule } from '../components/list-module/custom-list.module';


@NgModule({
  declarations: [
    TaskListComponent,
  ],
  imports: [
    CustomListModule,
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
