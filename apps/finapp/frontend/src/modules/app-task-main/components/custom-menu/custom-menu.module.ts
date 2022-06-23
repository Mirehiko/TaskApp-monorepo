import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMenuComponent } from './custom-menu.component';
import { CustomContextMenuDirective } from './custom-context-menu.directive';
import { CustomMenuItemComponent } from './custom-menu-item/custom-menu-item.component';


@NgModule({
  declarations: [CustomMenuComponent, CustomContextMenuDirective, CustomMenuItemComponent],
  imports: [CommonModule],
  exports: [CustomMenuComponent, CustomContextMenuDirective, CustomMenuItemComponent]
})
export class CustomMenuModule {}
