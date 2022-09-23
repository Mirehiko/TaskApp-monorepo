import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomElementsModule } from '../custom-elements.module';
import { NestedListComponent } from './nested-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    NestedListComponent,

  ],
  imports: [
    CommonModule,
    DragDropModule,
    CustomElementsModule,
  ],
  exports: [
    NestedListComponent,
  ],
  providers: []
})
export class NestedListModule {}
