import { NgModule } from "@angular/core";
import { TaskAppComponent } from './task-app.component';
import { TaskAppRoutingModule } from './task-app-routing.module';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [
    TaskAppComponent,
    HeaderComponent
  ],
  imports: [
    TaskAppRoutingModule,
  ],
  entryComponents: [
  ],
  exports: [
  ]
})
export class TaskAppModule {
}
