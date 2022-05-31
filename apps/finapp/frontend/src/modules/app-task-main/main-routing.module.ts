import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from './main.component';
import { AuthGuard } from '../../app/shared/classes/auth.guard';


const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    canActivate: [ AuthGuard ],
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
