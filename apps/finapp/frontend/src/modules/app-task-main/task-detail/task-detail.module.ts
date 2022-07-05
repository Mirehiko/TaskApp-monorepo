import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { CustomListModule } from '../components/list-module/custom-list.module';
import { DndTreeModule } from '../components/dnd-tree/dnd-tree.module';
import { CommonModule } from '@angular/common';
import { CustomElementsModule } from '../components/custom-elements.module';
import { MatModule } from '../../../app/shared/app-common.module';
import { NavigablePageModule } from '../components/navigable-page/navigable-page.module';
import { TaskDetailComponent } from './task-detail.component';
import { ReactiveFormsModule } from '@angular/forms';


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
  ]
})
export class TaskDetailModule {
}
