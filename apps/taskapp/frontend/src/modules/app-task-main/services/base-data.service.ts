import { BehaviorSubject } from 'rxjs';
import { ITreeItem } from '../components/list-module/base-list.component';
import { Injectable } from '@angular/core';
import { BaseTreeEntityRestService } from './rest/base-tree-entity-rest.service';


@Injectable()
export abstract class BaseTreeDatabaseService<requestDto, responseDto, params> {
  private _expanded: boolean = false;
  private _childCount: number = 0;
  protected parents = new Map<ITreeItem<responseDto> | -1, ITreeItem<responseDto>[]>();
  protected childParent = new Map<ITreeItem<responseDto>, ITreeItem<responseDto> | -1>();
  protected pinnedGroup = new ITreeItem();
  public _dataChange = new BehaviorSubject<ITreeItem<responseDto>[]>([]);
  private list: ITreeItem<responseDto>[] = [];
  public initGroups: boolean = false;

  constructor(
    protected rest: BaseTreeEntityRestService<requestDto, responseDto, params>
  ) {
    this.pinnedGroup.data = {};
    this.pinnedGroup.data.id = -2;
    this.pinnedGroup.data.parent_id = -1;
    this.pinnedGroup.data.name = 'Pinned';
    this.pinnedGroup.children = [];
    this.pinnedGroup.id = -2;
    this.pinnedGroup.isGroup = true;
    this.initialize();
  }

  public abstract restInsert(items: ITreeItem<responseDto>[], parentId?: number): Promise<ITreeItem<responseDto>[]>;
  public abstract restUpdate(item: ITreeItem<responseDto>, name: string): Promise<void>;

  public initialize(items: ITreeItem<responseDto>[] = [], expanded: boolean = true) {
    // this.expanded = expanded;
    // this._filterPinned(items);
    this.list = [this.pinnedGroup, ...items];
    this._map(this.list, -1);
    this._countChildren();
    this.initGroups = true;
    this._dataChange.next(this.list);
  }

  public get data(): ITreeItem<responseDto>[] {
    // return this._dataChange.value;
    return this.list;
  }

  public async addChildren(parent: ITreeItem<responseDto>, items: ITreeItem<responseDto>[]): Promise<ITreeItem<responseDto>[]> {
    const createdItems = await this.restInsert(items, parent.id);

    const children = this.parents.get(parent);
    parent.children = !children ? createdItems : [...parent.children, ...createdItems];
    this.parents.set(parent, parent.children);

    createdItems.forEach(item => {
      this.childParent.set(item, parent);
    });

    this._dataChange.next(this.data);
    return createdItems;
  }

  public async insertTo(item: ITreeItem<responseDto>, items: ITreeItem<responseDto>[], position?: number): Promise<ITreeItem<responseDto>[]> {
    const parent_id = item.data.parent_id ? Number(item.data.parent_id) : -1;
    const parentNode = this.childParent.get(item);
    if (!this.parents.get(parentNode!)) {
      this.parents.set(parentNode!, []);
      item.children = [];
    }
    const createdItems = await this.restInsert(items, parent_id);

    let insertIndex = position ? position : this.parents.get(parentNode!)?.findIndex(i => i.id === item.id);
    if (parentNode && parentNode !== -1) {
      this.parents.get(parentNode!)?.splice(insertIndex! + 1, 0, ...createdItems);
    }

    createdItems.forEach(i => {
      this.childParent.set(i, parentNode!);
    });
    this._dataChange.next(this.data);
    // this._recalculatePositions();
    this._countChildren();
    return createdItems;
  }

  public async updateItem(item: ITreeItem<responseDto>, name: string): Promise<void> {
    await this.restUpdate(item, name);
    const parent = this.childParent.get(item);
    this.parents.get(parent!)?.map(i => i.id === item.id ? item : i);
    this._dataChange.next(this.data);
  }

  public get childCount(): number {
    return this._childCount;
  }

  public async removeItem(item: ITreeItem<responseDto>): Promise<void> {
    const parent = this.childParent.get(item);

    if (!parent) {
      return;
    }

    const index = this.parents.get(parent!)?.findIndex(i => i.id === item.id);

    if (index === -1) {
      return;
    }

    await this.rest.delete(item.id);

    this.parents.get(parent!)
      ?.splice(index!, 1);
    this.childParent.delete(item);
    this._dataChange.next(this.data);
    this._countChildren();
  }

  private _map(data: ITreeItem<responseDto>[], parent: ITreeItem<responseDto> | -1): void {
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

  private _counter(list: ITreeItem<responseDto>[]): number {
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

  public pin(groupId: string, item: ITreeItem<responseDto>): void {
    this._pinItem(item, true);
    this.list[0].children.push(item);
    const parentNode: ITreeItem<responseDto> = this.childParent.get(item) as ITreeItem<responseDto>;
    const children = this.parents.get(parentNode!);
    const index = children!.findIndex(i => i.id === item.id);
    children!.splice(index, 1);
    this._dataChange.next(this.data);
  }

  public unpin(groupId: string, item: ITreeItem<responseDto>): void {
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

  private _pinItem(item: ITreeItem<responseDto>, isPinned: boolean): void {
    item.pinned = isPinned;
    item.children?.map(ch => {
      ch.pinned = isPinned;
      this._pinItem(ch, isPinned);
      return ch;
    });
  }

  // private _filterPinned(data: ITreeItem<responseDto>[]): void {
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
  // private excludePinned(data: ITreeItem<responseDto>[]): ITreeItem<responseDto>[] {
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
