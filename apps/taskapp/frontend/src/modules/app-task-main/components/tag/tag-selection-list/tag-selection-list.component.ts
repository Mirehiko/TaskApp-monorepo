import { Component } from '@angular/core';

@Component({
  selector: 'tag-selection-list',
  templateUrl: 'tag-selection-list.component.html',
  styleUrls: ['tag-selection-list.component.scss']
})
export class TagSelectionListComponent {

  getValue(value: string) {
    console.log(value)
  }
}
