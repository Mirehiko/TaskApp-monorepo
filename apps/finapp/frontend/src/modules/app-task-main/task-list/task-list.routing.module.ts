import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TaskListComponent } from './task-list.component';


const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    children: [
      {
        path: ':taskId',
        loadChildren: () => import("../task-detail/task-detail.module").then(m => m.TaskDetailModule),
      },
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class TaskListRoutingModule {
}
