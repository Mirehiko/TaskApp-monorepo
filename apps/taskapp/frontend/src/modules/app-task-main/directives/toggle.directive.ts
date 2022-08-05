import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';


@Directive({
  selector: '[appToggle]'
})
export class ToggleDirective {
  @Input() value: boolean;
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('click') onMouseClick(e: MouseEvent) {
    this.value = !this.value;
  }
}
