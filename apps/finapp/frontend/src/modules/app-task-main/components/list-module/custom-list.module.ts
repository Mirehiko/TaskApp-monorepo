import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from './base-list.component';


@NgModule({
  declarations: [
    BaseListComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BaseListComponent,
  ],
})
export class CustomListModule { }
