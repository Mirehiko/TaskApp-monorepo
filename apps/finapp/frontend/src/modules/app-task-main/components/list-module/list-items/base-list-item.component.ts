import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IListItem } from '../base-list.component';


@Component({
  selector: 'app-base-list-item',
  templateUrl: './base-list-item.component.html',
  styleUrls: ['base-list-item.component.scss']
})
export class BaseListItemComponent<T> {
  @Input() item: IListItem<T>;
  @Input() selectable: boolean = false;
  @Output() itemClicked: EventEmitter<IListItem<T>> = new EventEmitter<IListItem<T>>();

  onItemClicked(item: IListItem<T>): void {
    this.itemClicked.emit(item);
  }
}
