import { NgModule } from '@angular/core';
import { CustomListModule } from './list-module/custom-list.module';
import { DndTreeModule } from './dnd-tree/dnd-tree.module';
import { CustomElementsModule } from './custom-elements.module';


@NgModule({
  imports: [
    CustomElementsModule,
  ],
  exports: [
    CustomListModule,
    DndTreeModule,
  ]
})
export class CustomModulesModule {}
