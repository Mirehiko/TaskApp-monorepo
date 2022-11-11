import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: '[custom-menu-item]',
  templateUrl: 'custom-menu-item.component.html',
  styleUrls: ['custom-menu-item.component.scss']
})
export class CustomMenuItemComponent {
  @HostBinding('class') class = 'custom-menu-item';
}
