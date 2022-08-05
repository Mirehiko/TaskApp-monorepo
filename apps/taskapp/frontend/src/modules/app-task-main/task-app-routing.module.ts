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
        path: 'dashboard',
        loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
      },
      {
        path: 'tlp/archive',
        loadChildren: () => import("./task-list/task-list.module").then(m => m.TaskListModule),
      },
      {
        path: 'ttp',
        loadChildren: () => import("./task-list/task-list.module").then(m => m.TaskListModule),
      },
      {
        path: 'tags/trash',
        loadChildren: () => import("./task-list/task-list.module").then(m => m.TaskListModule),
      },
      {
        path: 'statistics'
      },
      { path: '**', redirectTo: 'dashboard' }
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
