import { ITreeItem } from '../../components/list-module/base-list.component';
import { AbstractGroup } from './abstract-group';


/**
 * Tree groups
 */
export class BaseTreeGroupList<T> extends AbstractGroup<T> {
  private _list: ITreeItem<T>[] = [];
  private _expanded: boolean = false;
  private _childCount: number = 0;
  private mapParents: Map<ITreeItem<T> | -1, ITreeItem<T>[]> = new Map<ITreeItem<T> | -1, ITreeItem<T>[]>();
  private mapChildren: Map<ITreeItem<T>, ITreeItem<T> | -1> = new Map<ITreeItem<T>, ITreeItem<T> | -1>();


  constructor(name: string, items: ITreeItem<T>[] = [], expanded: boolean = true) {
    super(name);
    this._list = items;
    this.expanded = expanded;
    this._countChildren();
    this._map(this._list, -1);
  };

  private _map(data: ITreeItem<T>[], parent: ITreeItem<T> | -1): ITreeItem<T>[] {
    return data.map(item => {
      this.mapParents.set(item, item.children || []);
      this.mapChildren.set(item, parent);
      if (item.children?.length) {
        item.children = this._map(item.children, item);
      }
      return item;
    });
  }

  public insertTo(item: ITreeItem<T>, position?: number): void {
    item.groupId = this.id;

    let parent = this.mapChildren.get(item);
    if (!parent) {
      this.list.push(item);
      this.mapParents.set(item, []);
      this.mapChildren.set(item, -1);
    }
    else {
      if (position) {
        this.mapParents.get(parent!)?.splice(position + 1, 0, item);
      }
      else {
        this.mapParents.get(parent!)?.push(item);
      }
    }
    this._recalculatePositions();
    this._countChildren();
  }

  public updateItem(item: ITreeItem<T>): void {
    const parent = this.mapChildren.get(item);
    this.mapParents.get(parent!)?.map(i => i.id === item.id ? item : i);
  }

  public get childCount(): number {
    return this._childCount;
  }

  public remove(item: ITreeItem<T>): void {
    const parent = this.mapChildren.get(item);
    const index = this.mapParents.get(parent!)?.findIndex(i => i.id === item.id);
    if (!index) {
      return;
    }
    this.mapParents.get(parent!)
      ?.splice(index + 1, 1);
    this.mapChildren.delete(item);
    this._countChildren();
  }

  public get list(): ITreeItem<T>[] {
    return this._list;
  }

  public get expanded(): boolean {
    return this._expanded;
  }

  public toggleExpand(): void {
    this._expanded = !this._expanded;
  }

  public set expanded(value: boolean) {
    this._expanded = value;
  }

  private _countChildren(): void {
    this._childCount = this._counter(this._list);
  }

  private _counter(list: ITreeItem<T>[]): number {
    return list.reduce((sum, item) => sum += !!item.children?.length ? this._counter(item.children) + 1 : 1, 0);
  }

  public setItemPosition(id: number, position: number): void {
    // TODO: fix with deep
    const currentItemPosition = this._list.findIndex(d => d.id === id);
    if (currentItemPosition === -1) {
      return;
    }
    const element = this._list.splice(currentItemPosition, 1);
    this._list.splice(position, 0, element[0]);
    this._recalculatePositions();
  }

  private _recalculatePositions(): void {
    // TODO: recalculate positions
    this._list.map(item => {
      // item.position =
    })
  }

  public clear(): void {
    this.mapParents.clear();
    this._list = [];
    this._childCount = 0;
  }

}
