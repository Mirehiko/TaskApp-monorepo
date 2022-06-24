import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IListItem } from '../list-module/base-list.component';


@Injectable()
export class DndTreeDatabaseService<T> {
  public _dataChange = new BehaviorSubject<IListItem<T>[]>([]);

  public get data(): IListItem<T>[] {
    return this._dataChange.value;
  }

  constructor() {
    this.initialize();
  }


  public initialize(data: IListItem<T>[] = []) {
    this._dataChange.next(data);
  }

  /**
   * Add new item to tree
   * @param parent
   * @param item
   */
  public insertItem(parent: IListItem<T> | null, items: IListItem<T>[]): void {
    if (!parent) {
      items.forEach(item => {
        this._dataChange.value.push(item);
      });
    }
    else {
      if (!parent.children) {
        parent.children = [];
      }

      items.forEach(item => {
        parent.children.push(item);
      });
    }

    this._dataChange.next(this.data);
  }

  /**
   * Save new item
   * @param item
   */
  public updateItem(node: IListItem<T>, name: string): void {
    node.data.name = name;
    this._dataChange.next(this.data);
  }

  public removeItem(node: IListItem<T>): void {

  }
}
