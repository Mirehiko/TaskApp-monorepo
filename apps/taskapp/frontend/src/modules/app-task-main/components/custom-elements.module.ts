import { NgModule } from '@angular/core';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { CommonModule } from '@angular/common';
import { CustomMenuModule } from './custom-menu/custom-menu.module';
import { EmptyMessageComponent } from './empty-message/empty-message.component';
import { CustomDirectivesModule } from '../directives/custom-directives.module';


@NgModule({
  declarations: [
    CustomCheckboxComponent,
    EmptyMessageComponent,
  ],
  imports: [
    CommonModule,
    CustomMenuModule,
    CustomDirectivesModule,
  ],
  exports: [
    CustomCheckboxComponent,
    CustomDirectivesModule,
    CustomMenuModule,
    EmptyMessageComponent,
  ]
})
export class CustomElementsModule {}
