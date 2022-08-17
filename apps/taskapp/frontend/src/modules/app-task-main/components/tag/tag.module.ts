import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag.component';
import { TagItemComponent } from './tag-item/tag-item.component';


@NgModule({
  declarations: [TagComponent, TagItemComponent],
  imports: [CommonModule],
  exports: [TagComponent, TagItemComponent]
})
export class TagModule {}
