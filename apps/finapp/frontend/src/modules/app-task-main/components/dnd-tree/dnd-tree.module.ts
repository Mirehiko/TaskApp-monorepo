import { NgModule } from '@angular/core';
import { DndTreeComponent } from './dnd-tree.component';
import { CommonModule } from '@angular/common';
import { MatModule } from '../../../../app/shared/app-common.module';
import { CustomElementsModule } from '../custom-elements.module';


@NgModule({
  declarations: [
    DndTreeComponent
  ],
  imports: [
    CommonModule,
    CustomElementsModule,
    MatModule,
  ],
  exports: [
    DndTreeComponent
  ]
})
export class DndTreeModule{}
