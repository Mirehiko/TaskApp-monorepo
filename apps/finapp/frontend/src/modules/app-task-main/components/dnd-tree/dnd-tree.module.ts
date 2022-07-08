import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from '../../../../app/shared/app-common.module';
import { CustomElementsModule } from '../custom-elements.module';
import { TaskTreeComponent } from './task-tree/task-tree.component';
import { BaseTreeComponent } from './base-tree.component';


@NgModule({
  declarations: [
    BaseTreeComponent,
    TaskTreeComponent,
  ],
  imports: [
    CommonModule,
    CustomElementsModule,
    MatModule,
  ],
  exports: [
    TaskTreeComponent
  ]
})
export class DndTreeModule{}
