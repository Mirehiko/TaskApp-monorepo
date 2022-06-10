import { NgModule } from '@angular/core';
import { CustomListModule } from './list-module/custom-list.module';


@NgModule({
  exports: [
    CustomListModule
  ]
})
export class CustomElementsModule {}
