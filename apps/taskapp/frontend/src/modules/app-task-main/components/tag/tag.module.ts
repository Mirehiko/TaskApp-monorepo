import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { TagListComponent } from './tag-list/tag-list.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { OptionsItemComponent } from './options-list/options-item/options-item.component';
import { ListItemComponent } from './tag-list/list-item/list-item.component';


@NgModule({
  declarations: [TagComponent, TagListComponent, ListItemComponent, OptionsItemComponent, OptionsListComponent],
  imports: [CommonModule, CustomDirectivesModule],
  exports: [TagComponent, TagListComponent, ListItemComponent, OptionsItemComponent, OptionsListComponent]
})
export class TagModule {}
