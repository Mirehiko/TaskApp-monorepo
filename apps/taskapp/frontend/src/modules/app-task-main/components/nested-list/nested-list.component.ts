import {
  Component,
  ContentChild,
  Input,
  TemplateRef
} from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-nested-list',
  templateUrl: 'nested-list.component.html',
  styleUrls: ['nested-list.component.scss']
})
export class NestedListComponent {
  @Input() data: any[] = [];
  @ContentChild('item',{static: false}) itemTemplateRef: TemplateRef<any>;
  @Input() listTitle: string = 'default list title';
  @Input() withTitle: boolean = false;

  drop(event: any) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }
}
