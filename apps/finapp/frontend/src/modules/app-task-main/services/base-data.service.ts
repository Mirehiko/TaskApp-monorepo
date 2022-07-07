import { BehaviorSubject } from 'rxjs';
import { ITreeItem } from '../components/list-module/base-list.component';


export class BaseTreeDatabaseService<T> {
  private _expanded: boolean = false;
  private _childCount: number = 0;
  protected parents = new Map<ITreeItem<T> | -1, ITreeItem<T>[]>();
  protected childParent = new Map<ITreeItem<T>, ITreeItem<T> | -1>();
  public _dataChange = new BehaviorSubject<ITreeItem<T>[]>([]);
  private list: ITreeItem<T>[] = [];
  constructor() {
    this.initialize();
  }


  public initialize(items: ITreeItem<T>[] = [], expanded: boolean = true) {
    // this.expanded = expanded;
    this.list = items;
    this._map(this.list, -1);
    this._countChildren();
    this._dataChange.next(this.list);
  }

  public get data(): ITreeItem<T>[] {
    return this._dataChange.value;
  }

  public addChildren(parent: ITreeItem<T>, items: ITreeItem<T>[]): void {
    if (!parent.children) {
      parent.children = [];
    }

    const p = this.parents.get(parent!);
    items.forEach(item => {
      p?.push(item);
      this.childParent.set(item, parent);
    });

    this._dataChange.next(this.data);
  }

  public insertTo(item: ITreeItem<T>, items: ITreeItem<T>[], position?: number): void {
    // item.groupId = this.id;

    const parentNode = this.childParent.get(item);
    const parent = this.parents.get(parentNode!);

    if (position) {
      this.parents.get(parentNode!)?.splice(position + 1, 0, ...items);
    }
    else {
      const index = parent?.findIndex(i => i.id === item.id);
      this.parents.get(parentNode!)?.splice(index! + 1, 0, ...items);
    }

    items.forEach(i => {
      this.childParent.set(i, parentNode!);
    })
    this._dataChange.next(this.data);

    // this._recalculatePositions();
    this._countChildren();
  }

  public updateItem(item: ITreeItem<T>, name: string): void {
    const parent = this.childParent.get(item);
    this.parents.get(parent!)?.map(i => i.id === item.id ? item : i);
    this._dataChange.next(this.data);
  }

  public get childCount(): number {
    return this._childCount;
  }

  public removeItem(item: ITreeItem<T>): void {
    const parent = this.childParent.get(item);

    if (!parent) {
      return;
    }

    const index = this.parents.get(parent!)?.findIndex(i => i.id === item.id);

    if (index === -1) {
      return;
    }
    this.parents.get(parent!)
      ?.splice(index!, 1);
    this.childParent.delete(item);
    this._dataChange.next(this.data);
    this._countChildren();
  }

  private _map(data: ITreeItem<T>[], parent: ITreeItem<T> | -1): void {
    data.forEach(item => {
      this.parents.set(item, item.children || []);
      this.childParent.set(item, parent);
      if (item.children?.length) {
        this._map(item.children, item);
      }
    });
  }

  private _countChildren(): void {
    this.list.map(i => {
      if (i.isGroup) {
        i.childCount = this._counter(i.children);
      }
    })
  }

  private _counter(list: ITreeItem<T>[]): number {
    return list.reduce((sum, item) => sum += !!item.children?.length ? this._counter(item.children) + 1 : 1, 0);
  }

  public setItemPosition(id: number, position: number): void {
    // TODO: fix with deep
    const currentItemPosition = this.data.findIndex(d => d.id === id);
    if (currentItemPosition === -1) {
      return;
    }
    const element = this.data.splice(currentItemPosition, 1);
    this.data.splice(position, 0, element[0]);
    this._recalculatePositions();
  }

  private _recalculatePositions(): void {
    // TODO: recalculate positions
    this.data.map(item => {
      // item.position =
    })
  }

  public clear(): void {
    this.parents.clear();
    this.childParent.clear();
    this._dataChange.next(this.data);
    // this._childCount = 0;
  }
}













