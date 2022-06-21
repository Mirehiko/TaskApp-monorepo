import { NgModule } from '@angular/core';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { CommonModule } from '@angular/common';
import { TitleEditableDirective } from '../directives/title-editable.directive';


@NgModule({
  declarations: [
    CustomCheckboxComponent,
    TitleEditableDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CustomCheckboxComponent,
    TitleEditableDirective,
  ]
})
export class CustomElementsModule {}
