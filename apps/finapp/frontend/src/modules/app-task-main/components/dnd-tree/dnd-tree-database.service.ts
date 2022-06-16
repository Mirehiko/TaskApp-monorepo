import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IListItemField } from '../list-module/base-list.component';


export class TreeItem {
  id: number;
  fields: IListItemField[];
  data: any;
  pinned?: boolean;
  position?: number;
  children: TreeItem[];
  parentId: number;
}

@Injectable()
export class DndTreeDatabaseService {
  public _dataChange = new BehaviorSubject<TreeItem[]>([]);

  public get data(): TreeItem[] {
    return this._dataChange.value;
  }

  constructor() {
    this.initialize();
  }


  public initialize(data: TreeItem[] = []) {
    this._dataChange.next(data);
  }

  /**
   * Add new item to tree
   * @param parent
   * @param item
   */
  public insertItem(parent: TreeItem | null, items: TreeItem[]): void {
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
  public updateItem(node: TreeItem, name: string): void {
    node.data.name = name;
    this._dataChange.next(this.data);
  }

  public removeItem(node: TreeItem): void {

  }
}
