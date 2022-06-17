import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: 'custom-checkbox.component.html',
  styleUrls: ['custom-checkbox.component.scss']
})
export class CustomCheckboxComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('class') class = 'custom-checkbox';

  onChange(): void {
    this.checkedChange.emit(this.checked);
  }
}
