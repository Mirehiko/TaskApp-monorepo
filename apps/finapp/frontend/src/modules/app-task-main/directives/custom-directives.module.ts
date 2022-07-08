import { NgModule } from '@angular/core';
import { ToggleDirective } from './toggle.directive';
import { CustomInputDirective, CustomListInputDirective } from './custom-input.directive';


@NgModule({
  declarations: [
    ToggleDirective,
    CustomInputDirective,
    CustomListInputDirective,
  ],
  exports: [
    ToggleDirective,
    CustomInputDirective,
    CustomListInputDirective,
  ]
})
export class CustomDirectivesModule {}
