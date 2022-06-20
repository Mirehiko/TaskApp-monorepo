import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/classes/auth.guard';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import("../modules/auth/auth.module").then(m => m.AuthModule),
  },
  {
    path: 'taskapp',
    canActivate: [ AuthGuard ],
    loadChildren: () => import("../modules/app-task-main/task-app.module").then(m => m.TaskAppModule),
  },
  // {
  //   path: 'finapp',
  //   // canActivate: [ AuthGuard ],
  //   loadChildren: () => import("../modules/app-fin-main/fin-app.module").then(m => m.FinAppModule),
  // },
  {
    path: 'administration',
    canActivate: [ AuthGuard ],
    loadChildren: () => import("../modules/admin/admin.module").then(m => m.AdminModule),
  },
  // { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
