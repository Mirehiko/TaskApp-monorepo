import { NgModule } from "@angular/core";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from './main.component';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    MainRoutingModule,
  ],
  entryComponents: [
  ],
  exports: [
  ]
})
export class MainModule {
}
