import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TaskAppComponent } from './task-app.component';
import { TaskListComponent } from './task-list/task-list.component';


const routes: Routes = [
  {
    path: "",
    component: TaskAppComponent,
    children: [
      {
        path: 'dashboard'
      },
      {
        path: 'tlp/archive',
        component: TaskListComponent,
      },
      {
        path: 'ttp',
        loadChildren: () => import("./task-list/task-list.module").then(m => m.TaskListModule),
      },
      {
        path: 'tags/trash',
        component: TaskListComponent,
      },
      {
        path: 'tasks#trash',
        component: TaskListComponent,
      },
      {
        path: 'statistics'
      },

    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class TaskAppRoutingModule {
}
