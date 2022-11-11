import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "administration",
  },
  {
    path: "",
    component: AdminComponent,
    // canActivate: [ AuthGuard ],
    children: [
      // {
      //   path: "dashboard",
      //   loadChildren: () => import("./pages/dashboard/dashboard.module").then(m => m.DashboardModule),
      // },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class AdminRoutingModule {
}
