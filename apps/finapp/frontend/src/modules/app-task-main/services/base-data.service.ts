import { BehaviorSubject } from 'rxjs';
import { ITreeItem } from '../components/list-module/base-list.component';


export class BaseTreeDatabaseService<T> {
  private _expanded: boolean = false;
  private _childCount: number = 0;
  protected parents = new Map<ITreeItem<T> | -1, ITreeItem<T>[]>();
  protected childParent = new Map<ITreeItem<T>, ITreeItem<T> | -1>();
  protected pinnedGroup = new ITreeItem();
  public _dataChange = new BehaviorSubject<ITreeItem<T>[]>([]);
  private list: ITreeItem<T>[] = [];
  public initGroups: boolean = false;

  constructor() {
    this.pinnedGroup.data = {};
    this.pinnedGroup.data.id = -2;
    this.pinnedGroup.data.parent_id = -1;
    this.pinnedGroup.data.name = 'Pinned';
    this.pinnedGroup.children = [];
    this.pinnedGroup.id = -2;
    this.pinnedGroup.isGroup = true;
    this.initialize();
  }


  public initialize(items: ITreeItem<T>[] = [], expanded: boolean = true) {
    // this.expanded = expanded;
    // this._filterPinned(items);
    this.list = [this.pinnedGroup, ...items];
    this._map(this.list, -1);
    this._countChildren();
    this.initGroups = true;
    this._dataChange.next(this.list);
  }

  public get data(): ITreeItem<T>[] {
    // return this._dataChange.value;
    return this.list;
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

  public pin(groupId: string, item: ITreeItem<T>): void {
    this._pinItem(item, true);
    this.list[0].children.push(item);
    const parentNode: ITreeItem<T> = this.childParent.get(item) as ITreeItem<T>;
    const children = this.parents.get(parentNode!);
    const index = children!.findIndex(i => i.id === item.id);
    children!.splice(index, 1);
    this._dataChange.next(this.data);
  }

  public unpin(groupId: string, item: ITreeItem<T>): void {
    this._pinItem(item, false);
    const index = this.list[0].children.findIndex(i => i.id === item.id);
    this.list[0].children.splice(index, 1);
    const parentNode = this.childParent.get(item);
    this.parents.get(parentNode!)?.push(item);

    // if (!this.list[0].children.length || this.parents.get(parentNode!)?.length === 1) {
    //   this.initGroups = true;
    // }

    this._dataChange.next(this.data);
  }

  private _pinItem(item: ITreeItem<T>, isPinned: boolean): void {
    item.pinned = isPinned;
    item.children?.map(ch => {
      ch.pinned = isPinned;
      this._pinItem(ch, isPinned);
      return ch;
    });
  }

  // private _filterPinned(data: ITreeItem<T>[]): void {
  //   data.forEach(item => {
  //     if (item.pinned) {
  //       this.pinnedGroup.children.push(item);
  //     }
  //     if (item.children?.length) {
  //       this._filterPinned(item.children);
  //     }
  //   });
  // }
  //
  // private excludePinned(data: ITreeItem<T>[]): ITreeItem<T>[] {
  //   return data.filter
  // }

  // public fillPinnedGroup(): void {
  //   this.list.forEach(group => {
  //     group.list.map(item => {
  //       if (item.pinned) {
  //         this._pinnedRows.insertTo(item);
  //       }
  //     });
  //     this._pinnedRows.list.forEach(item => {
  //       group.remove(item);
  //     });
  //   })
  // }

  public clear(): void {
    this.parents.clear();
    this.childParent.clear();
    this._dataChange.next(this.data);
    // this._childCount = 0;
  }
}













