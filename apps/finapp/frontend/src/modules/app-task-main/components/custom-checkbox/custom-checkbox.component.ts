import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: 'custom-checkbox.component.html',
  styleUrls: ['custom-checkbox.component.scss']
})
export class CustomCheckboxComponent {
  @Input() checked: boolean = false;
  @Input() checkboxOnly: boolean = false;
  @Input() indeterminate: boolean = false;
  @Output() checkedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('class') class = 'custom-checkbox';

  onChange(evt: any): void {
    if (this.checkboxOnly) return;
    this.checkedChanged.emit(evt.target.checked);
  }

  checkboxClicked(evt: any): void {
    if (!this.checkboxOnly) {
      return;
    }
    if (evt.target.closest('.ico')) {
      // evt.stopPropagation();
      // evt.preventDefault();
      this.checked = !this.checked;
      this.checkedChanged.emit(this.checked);
    }
  }
}
