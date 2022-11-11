import { Component, HostBinding } from '@angular/core';

@Component({
  selector: '[options-item]',
  templateUrl: 'options-item.component.html',
  styleUrls: ['options-item.component.scss']
})
export class OptionsItemComponent {
  @HostBinding('class') class = 'options-item';
}
