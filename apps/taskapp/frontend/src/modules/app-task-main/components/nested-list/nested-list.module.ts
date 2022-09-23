import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomElementsModule } from '../custom-elements.module';
import { NestedListComponent } from './nested-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NestedListItemComponent } from './nested-list-item/nested-list-item.component';


@NgModule({
  declarations: [
    NestedListComponent,
    NestedListItemComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    CustomElementsModule,
  ],
  exports: [
    NestedListComponent,
    NestedListItemComponent,
  ],
  providers: []
})
export class NestedListModule {}
