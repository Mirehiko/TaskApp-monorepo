import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: '[tag-item]',
  templateUrl: 'tag-item.component.html',
  styleUrls: ['tag-item.component.scss']
})
export class TagItemComponent {
  @HostBinding('class') class = 'tag-item';
  @Output() onClose: EventEmitter<true> = new EventEmitter<true>();

  onClick(evt: Event): void {
    evt.stopPropagation();
    this.onClose.emit(true);
  }
}
