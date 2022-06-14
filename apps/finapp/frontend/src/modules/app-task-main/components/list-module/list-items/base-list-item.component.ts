import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IListItem } from '../base-list.component';


@Component({
  selector: 'app-base-list-item',
  templateUrl: './base-list-item.component.html',
  styleUrls: ['base-list-item.component.scss']
})
export class BaseListItemComponent {
  @Input() item: IListItem;
  @Input() selectable: boolean = false;
  @Output() itemClicked: EventEmitter<IListItem> = new EventEmitter<IListItem>();

  onItemClicked(item: IListItem): void {
    this.itemClicked.emit(item);
  }
}
