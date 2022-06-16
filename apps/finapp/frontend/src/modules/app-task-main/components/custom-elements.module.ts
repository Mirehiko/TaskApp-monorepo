import { NgModule } from '@angular/core';
import { CustomListModule } from './list-module/custom-list.module';
import { DndTreeModule } from './dnd-tree/dnd-tree.module';


@NgModule({
  exports: [
    CustomListModule,
    DndTreeModule,
  ]
})
export class CustomElementsModule {}
