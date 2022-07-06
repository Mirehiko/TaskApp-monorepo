import { BehaviorSubject } from 'rxjs';
import { IListItem, ITreeItem } from '../components/list-module/base-list.component';
import { nanoid } from 'nanoid';
import { Injectable } from '@angular/core';


export class BaseDataService<T> {
  public _dataChange = new BehaviorSubject<T[]>([]);

  public get data(): T[] {
    return this._dataChange.value;
  }

  constructor() {
    this.initialize();
  }


  public initialize(data: T[] = []) {
    this._dataChange.next(data);
  }

  /**
   * Add new item
   * @param parent
   * @param item
   */
  public insertItemTo(parent: IListItem<T>, item: IListItem<T>, items: IListItem<T>[]): void {
  }

  public addChildren(parent: T | null, items: T[]): void {
  }

  /**
   * Save new item
   * @param item
   */
  public updateItem(node: T, name: string): void {
  }

  public removeItem(node: T): void {
    this._dataChange.next(this.data.filter(i => i !== node))
  }
}

export class BaseDataChildrenService<T> extends BaseDataService<IListItem<T>> {
  constructor() {
    super();
  }

  public override insertItemTo(parent: IListItem<T> | null, item: IListItem<T>, items: IListItem<T>[]): void {
    if (parent) {
      const index = parent.children.findIndex(i => i.id === item.id);
      parent.children.splice(index + 1, 0, ...items);
      this._dataChange.next(this.data);
    }
    else {
      const index = this.data.findIndex(i => i.id === item.id);
      const data = this._dataChange.value;
      data.splice(index + 1, 0, ...items)
      this._dataChange.next(data);
    }
  }

  public override addChildren(parent: IListItem<T>, items: IListItem<T>[]): void {
    if (!parent.children) {
      parent.children = [];
    }

    items.forEach(item => {
      parent?.children?.push(item);
    });

    this._dataChange.next(this.data);
  }

  /**
   * Save new item
   * @param item
   */
  public override updateItem(item: IListItem<T>, name: string): void {
    // item.name = name;
    this._dataChange.next(this.data);
  }

  public override removeItem(removableItem: IListItem<T>): void {
    this._dataChange.next(this.deepFilter(this.data, removableItem));
  }

  private deepFilter(items: IListItem<T>[], removableItem: IListItem<T>): IListItem<T>[] {
    return items.filter(i => {
      if (i.children?.length) {
        i.children = this.deepFilter(i.children, removableItem);
      }
      return i.id !== removableItem.id;
    });
  }
}











export abstract class AbstractGroup<T> {
  private _name: string;
  readonly _id: string;

  constructor(name: string) {
    this._name = name;
    this._id = nanoid();
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get id(): string {
    return this._id;
  }

  public abstract get list(): any[];
  public abstract insertTo(item: any, position?: number): void;
  public abstract updateItem(item: any): void
  public abstract remove(item: any): void;
  public abstract clear(): void;

}

export abstract class AbstractGroupedList<BaseGroup, Item> {
  private _name: string;
  public data: IBaseGroupedData<BaseGroup>;
  public dataChange: BehaviorSubject<IBaseGroupedData<BaseGroup>>;

  constructor() {}

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public initialize(name: string = '') {
    this._name = name || this.name;
    this.dataChange = new BehaviorSubject<IBaseGroupedData<BaseGroup>>(this.data);
  }

  public refresh(): void {
    this.dataChange.next(this.data);
  }

  public get list(): BaseGroup[] {
    return this.data.list;
  }

  public addGroup(group: BaseGroup): void {
    this.data.list.push(group);
    this.refresh();
  }

  public clear(): void {
    this.data.list = [];
    this.refresh();
  }

  public get pinnedGroup(): BaseGroup {
    return this.data.pinned;
  }

  public abstract removeGroup(id: string): void;
  public abstract pin(item: Item): void;
  public abstract unpin(item: Item): void;
  public abstract fillPinnedGroup(): void
}

/**
 * Interfaces
 */
export interface IBaseGroupedData<T> {
  pinned: T,
  list: T[]
}

export interface IBaseGroupedListData<T> extends IBaseGroupedData<BaseGroupList<T>>{};

export interface IBaseGroupedTreeData<T> extends IBaseGroupedData<BaseTreeGroupList<T>>{};


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

export class BaseGroupedListService<T> extends AbstractGroupedList<BaseGroupList<T>, IListItem<T>> {

  constructor() {
    super();
    this.data = {
      pinned: new BaseGroupList<T>('Pinned'),
      list: []
    };
  }

  public getGroup(id: string): BaseGroupList<T> | null {
    const group = this.data.list.find(g => g.id === id);
    if (group) {
      return group;
    }
    throw new Error(`Group [${id}] does not exist`);
    return null;
  }

  public removeGroup(id: string): void {
    this.data.list = this.data.list.filter(g => g.id !== id);
    this.refresh();
  }

  public pin(item: IListItem<T>): void {
    this.data.pinned.insertTo(item);
    this.data.list.map(group => {
      if (group._id === item.groupId) {
        group.remove(item);
      }
    });
    this.refresh();
  }

  public unpin(item: IListItem<T>): void {
    this.data.pinned.remove(item);
    this.data.list.map(group => {
      if (group._id === item.groupId) {
        group.insertTo(item);
      }
    });
    this.refresh();
  }

  public fillPinnedGroup(): void {
    this.data.list.map(group => {
      group.list.map(item => {
        if (item.pinned) {
          this.data.pinned.insertTo(item);
        }
      });
      this.data.pinned.list.forEach(item => {
        group.remove(item);
      });
    });
    this.refresh();
  }
}


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

export class BaseGroupedTreeService<T> extends AbstractGroupedList<BaseTreeGroupList<T>, ITreeItem<T>>{

  constructor() {
    super();
    this.data = {
      pinned: new BaseTreeGroupList<T>('Pinned'),
      list: []
    };
  };

  public getGroup(id: string): BaseTreeGroupList<T> | null {
    const group = this.data.list.find(g => g.id === id);
    if (group) {
      return group;
    }
    throw new Error(`Group [${id}] does not exist`);
    return null;
  }

  public addItemToGroup(id: string, item: ITreeItem<T>): void {

  }

  public removeGroup(id: string): void {
    this.data.list = this.data.list.filter(g => g.id !== id);
    this.refresh();
  }

  public pin(item: ITreeItem<T>): void {
    this.data.pinned.insertTo(item);
    this.data.list.map(group => {
      if (group._id === item.groupId) {
        group.remove(item);
      }
    });
    this.refresh();
  }

  public unpin(item: ITreeItem<T>): void {
    this.data.pinned.remove(item);
    this.data.list.map(group => {
      if (group._id === item.groupId) {
        group.insertTo(item);
      }
    });
    this.refresh();
  }

  public fillPinnedGroup(): void {
    this.data.list.map(group => {
      group.list.map(item => {
        if (item.pinned) {
          this.data.pinned.insertTo(item);
        }
      });
      this.data.pinned.list.forEach(item => {
        group.remove(item);
      });
    });
    this.refresh();
  }
}
