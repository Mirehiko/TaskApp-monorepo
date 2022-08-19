import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag.component';
import { TagItemComponent } from './tag-item/tag-item.component';
import { TagSelectionListComponent } from './tag-selection-list/tag-selection-list.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';


@NgModule({
  declarations: [TagComponent, TagItemComponent, TagSelectionListComponent],
  imports: [CommonModule, CustomDirectivesModule],
  exports: [TagComponent, TagItemComponent]
})
export class TagModule {}
