import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { TagListComponent } from './tag-list/tag-list.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { OptionsListContainerComponent } from './options-list/options-list-container/options-list-container.component';
import { OptionsMenuDirective } from './options-list/options-menu.directive';
import { OptionsItemComponent } from './options-list/options-item/options-item.component';
import { ListItemComponent } from './tag-list/list-item/list-item.component';


@NgModule({
  declarations: [
    TagComponent,
    TagListComponent,
    ListItemComponent,
    OptionsItemComponent,
    OptionsListComponent,
    OptionsMenuDirective,
    OptionsListContainerComponent,
  ],
  imports: [CommonModule, CustomDirectivesModule],
  exports: [
    OptionsListContainerComponent,
    TagComponent, TagListComponent, ListItemComponent, OptionsItemComponent, OptionsListComponent, OptionsMenuDirective
  ]
})
export class TagModule {}
