import {
  Component,
  ContentChild, EventEmitter,
  Input, OnInit, Output,
  TemplateRef
} from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { BaseTreeDto } from '@taskapp/app-common';


@Component({
  selector: 'app-nested-list',
  templateUrl: 'nested-list.component.html',
  styleUrls: ['nested-list.component.scss']
})
export class NestedListComponent<T extends BaseTreeDto> {
  @Input() data: T[] = [];
  @Input() draggable: boolean = false;
  @Input() hasChildren: boolean = false;
  @ContentChild('item') itemTemplateRef: TemplateRef<any>;
  @Input() listTitle: string = 'default list title';
  @Input() withTitle: boolean = false;
  @Output() itemClick: EventEmitter<T> = new EventEmitter<T>();
  @Output() dataChanged: EventEmitter<T[]> = new EventEmitter<T[]>();
  public dragPosition: DragPosition | null = null;

  public draggingNode: T | null = null;
  public dragOverNode: T | null = null;
  public dragOverStyle: string = '';
  public IndexChanges: T[] = [];

  handleDragStart(event: any, item: T) {
    this.draggingNode = item;
  }

  handleDragOver(event: any, item: T) {
    event.preventDefault();
    this.dragOverNode = item;

    const percentageX = event.offsetX / event?.target?.clientWidth;
    const percentageY = event.offsetY / event?.target?.clientHeight;

    if (percentageY < 0.25) {
      this.dragPosition = DragPosition.BEFORE;
    } else if (percentageY > 0.75) {
      this.dragPosition = DragPosition.AFTER;
    } else {
      this.dragPosition = DragPosition.PUT;
    }
    this.dragOverStyle = `drag-over drag-${this.dragPosition}`;
  }

  handleDrop(event: any, item: T) {
    if (this.dragOverNode === null) {
      return;
    }
    const draggingIndex = this.data.findIndex(i => i.id === this.draggingNode!.id);

    switch (this.dragPosition) {
      case DragPosition.BEFORE: {
        this.data.splice(draggingIndex, 1);
        const dragOverIndex = this.data.findIndex(i => i.id === this.dragOverNode!.id);
        this.data.splice(dragOverIndex, 0, this.draggingNode!);
        break;
      }
      case DragPosition.AFTER: {
        this.data.splice(draggingIndex, 1);
        const dragOverIndex = this.data.findIndex(i => i.id === this.dragOverNode!.id);
        this.data.splice(dragOverIndex + 1, 0, this.draggingNode!);
        break;
      }
      case DragPosition.PUT: {
        break;
      }
      default: return;
    }

    this.dragPosition = null;
    this.dragOverNode = null;
    this.draggingNode = null;
    this.dragOverStyle = '';
  }

  handleDragEnd(event: any) {
    // this.dragOverNode = null;
  }

  getStyle(item: T): string {
    if (this.draggingNode === item) {
      return 'drag-dragging';
    }
    if (this.dragOverNode === item) {
      return this.dragOverStyle;
    }
    return '';
  }

  itemClicked(item: T) {
    this.itemClick.emit(item);
  }
}
export enum DragPosition {
  BEFORE = 'before',
  AFTER = 'after',
  PUT = 'put'
}
