import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMenuComponent } from './custom-menu.component';
import { CustomContextMenuDirective } from './custom-context-menu.directive';


@NgModule({
  declarations: [CustomMenuComponent, CustomContextMenuDirective],
  imports: [CommonModule],
  exports: [CustomMenuComponent, CustomContextMenuDirective]
})
export class CustomMenuModule {}
