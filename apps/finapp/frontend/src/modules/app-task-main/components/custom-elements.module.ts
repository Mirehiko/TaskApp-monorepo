import { NgModule } from '@angular/core';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { CommonModule } from '@angular/common';
import { TitleEditableDirective } from '../directives/title-editable.directive';
import { CustomMenuModule } from './custom-menu/custom-menu.module';


@NgModule({
  declarations: [
    CustomCheckboxComponent,
    TitleEditableDirective,
  ],
  imports: [
    CommonModule,
    CustomMenuModule,
  ],
  exports: [
    CustomCheckboxComponent,
    TitleEditableDirective,
    CustomMenuModule
  ]
})
export class CustomElementsModule {}
