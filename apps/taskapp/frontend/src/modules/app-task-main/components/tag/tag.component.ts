import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: '[custom-tag]',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent<T> {
}
