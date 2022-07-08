import { IListItem } from '../../components/list-module/base-list.component';
import { AbstractGroup } from './abstract-group';

/**
 * List groups
 */
export class BaseGroupList<T> extends AbstractGroup<T> {
  private _childCount: number = 0;
  private _list: IListItem<T>[] = [];

  constructor(name: string, items: IListItem<T>[] = []) {
    super(name);
    this._list = items;
  };

  public insertTo(item: any, position?: number): void {
    if (position) {
      this._list.splice(position, 0, item);
    }
    else {
      this._list.push(item);
    }
    this.recalculatePositions();
  }

  public updateItem(item: IListItem<T>): void {
    this._list.map(i => i.id == item.id ? item : i);
  }

  public remove(item: IListItem<T>): void {
    this._list = this.list.filter(i => item.id !== i.id);
  }

  public get list(): IListItem<T>[] {
    return this._list;
  }

  public setItemPosition(id: number, position: number): void {
    const currentItemPosition = this._list.findIndex(d => d.id === id);
    if (currentItemPosition === -1) {
      return;
    }
    const element = this._list.splice(currentItemPosition, 1);
    this._list.splice(position, 0, element[0]);
    this.recalculatePositions();
  }

  private recalculatePositions(): void {
    // TODO: recalculate positions
    this._list.map(item => {
      // item.position =
    })
  }

  public clear(): void {
    this._list = [];
    this._childCount = 0;
  }
}
