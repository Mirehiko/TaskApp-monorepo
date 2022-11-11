import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from './dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    DashboardRoutingModule,
  ],
  entryComponents: [
    DashboardComponent
  ],
  exports: [
  ]
})
export class DashboardModule {
}
