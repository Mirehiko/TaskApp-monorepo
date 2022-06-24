import { NgModule } from '@angular/core';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { CommonModule } from '@angular/common';
import { TitleEditableDirective } from '../directives/title-editable.directive';
import { CustomMenuModule } from './custom-menu/custom-menu.module';
import { ToggleDirective } from '../directives/toggle.directive';
import { EmptyMessageComponent } from './empty-message/empty-message.component';


@NgModule({
  declarations: [
    CustomCheckboxComponent,
    TitleEditableDirective,
    ToggleDirective,
    EmptyMessageComponent,
  ],
  imports: [
    CommonModule,
    CustomMenuModule,
  ],
  exports: [
    CustomCheckboxComponent,
    TitleEditableDirective,
    CustomMenuModule,
    ToggleDirective,
    EmptyMessageComponent,
  ]
})
export class CustomElementsModule {}
