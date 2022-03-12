import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from './main.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "projects",
  },
  {
    path: "",
    component: MainComponent,
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
export class MainRoutingModule {
}
