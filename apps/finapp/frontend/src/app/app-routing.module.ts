import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/classes/auth.guard';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import("../modules/auth/auth.module").then(m => m.AuthModule),
  },
  {
    path: 'main',
    // canActivate: [ AuthGuard ],
    loadChildren: () => import("../modules/app-task-main/main.module").then(m => m.MainModule),
  },
  {
    path: 'administration',
    loadChildren: () => import("../modules/admin/admin.module").then(m => m.AdminModule),
  },
  // { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: '/main/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
