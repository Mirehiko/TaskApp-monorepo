import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: '[custom-tag]',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent<T> {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  public focused: boolean = false;

  public changes(value: string) {
    this.valueChanged.emit(value);
  }

  public focusChanged(focused: boolean): void {
    if (focused) {
      this.focused = focused;
    }
  }

  public onClick(e: any): void {
    this.focused = false;
  }
}
