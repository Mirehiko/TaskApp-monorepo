import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { DndTreeModule } from '../components/dnd-tree/dnd-tree.module';
import { CommonModule } from '@angular/common';
import { CustomElementsModule } from '../components/custom-elements.module';
import { MatModule } from '../../../app/shared/app-common.module';
import { TaskDetailComponent } from './task-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseTreeDatabaseService } from '../services/base-data.service';


@NgModule({
  declarations: [
    TaskDetailComponent,
  ],
  imports: [
    CustomElementsModule,
    CommonModule,
    ReactiveFormsModule,
    MatModule,
    DndTreeModule,
    RouterModule.forChild([
      {
        path: "",
        component: TaskDetailComponent
      }
    ]),
  ],
  entryComponents: [
    TaskDetailComponent
  ],
  exports: [
  ],
})
export class TaskDetailModule {
}
