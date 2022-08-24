import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: '[list-item]',
  templateUrl: 'list-item.component.html',
  styleUrls: ['list-item.component.scss']
})
export class ListItemComponent {
  @HostBinding('class') class = 'list-item';
  @Output() onClose: EventEmitter<true> = new EventEmitter<true>();

  onClick(evt: Event): void {
    evt.stopPropagation();
    this.onClose.emit(true);
  }
}
