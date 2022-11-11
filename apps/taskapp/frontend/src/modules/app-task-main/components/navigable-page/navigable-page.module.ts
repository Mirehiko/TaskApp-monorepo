import { NgModule } from '@angular/core';
import { NavigablePageComponent } from './navigable-page.component';
import { CommonModule } from '@angular/common';
import { CustomElementsModule } from '../custom-elements.module';


@NgModule({
  declarations: [
    NavigablePageComponent
  ],
  imports: [
    CommonModule,
    CustomElementsModule,
  ],
  exports: [
    NavigablePageComponent
  ],
  providers: []
})
export class NavigablePageModule {}
