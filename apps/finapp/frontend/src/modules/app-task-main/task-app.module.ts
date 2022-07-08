import { NgModule } from "@angular/core";
import { TaskAppComponent } from './task-app.component';
import { TaskAppRoutingModule } from './task-app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { TaskRestService } from './services/rest/task-rest.service';


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
  ],
  providers: [TaskRestService]
})
export class TaskAppModule {
}
