import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from './auth.component';

const routes: Routes = [
  // {
  //   path: "login",
  //   component: PageLoginComponent,
  // },
  // {
  //   path: "registration",
  //   component: PageLoginComponent,
  //   // data: {
  //   //   restore: true
  //   // }
  // },
  // {
  //   path: "restore-password",
  //   component: PageLoginComponent,
  //   // data: {
  //   //   restore: true
  //   // }
  // },
  {
    path: "",
    component: AuthComponent,
    // canActivate: [ AuthGuard ],
    children: [
      {
        path: "",
        // loadChildren: () => import("./pages/dashboard/dashboard.module").then(m => m.DashboardModule),
      },
    ]
  },
  {
    path: "**",
    redirectTo: "/auth/login"
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class AuthRoutingModule {
}
