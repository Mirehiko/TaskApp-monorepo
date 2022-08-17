import { NgModule } from '@angular/core';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { CommonModule } from '@angular/common';
import { CustomMenuModule } from './custom-menu/custom-menu.module';
import { EmptyMessageComponent } from './empty-message/empty-message.component';
import { CustomDirectivesModule } from '../directives/custom-directives.module';
import { TagModule } from './tag/tag.module';
import { CustomCheckboxModule } from './custom-checkbox/custom-checkbox.module';


@NgModule({
  declarations: [
    EmptyMessageComponent,
  ],
  imports: [
    CommonModule,
    CustomMenuModule,
    CustomDirectivesModule,
    TagModule,
    CustomCheckboxModule,
  ],
  exports: [
    TagModule,
    CustomCheckboxModule,
    CustomDirectivesModule,
    CustomMenuModule,
    EmptyMessageComponent,
  ]
})
export class CustomElementsModule {}
