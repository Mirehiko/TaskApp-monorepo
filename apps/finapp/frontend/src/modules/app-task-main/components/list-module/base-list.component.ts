import {
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
  Component,
  OnInit,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { nanoid } from 'nanoid';


export type BaseList<T> = T[];

export interface IListGroup {
  name: string;
  type: any;
}

export interface IListItemFieldDescription {
  field: string;
  header?: String;
  valueGetter?: (params: any) => string;
  template?: string;
  hidden?: boolean;
}

export class IBaseListItem<T> {
  id: number;
  data: any;
  pinned?: boolean;
  position?: number;
  selected?: boolean;
  groupId?: string;
}

export class ITreeItem<T> extends IBaseListItem<T>{
  children: ITreeItem<T>[];
  parent_id?: number | string;
  childCount?: number;
  isGroup: boolean;
}

export interface IListItemField extends IListItemFieldDescription {
  value: any;
}

export class IListItem<T> extends IBaseListItem<T>{
  fields?: IListItemField[];
}

export interface IListConfig {
  listDescription: IListItemFieldDescription[];
  groups?: IListGroup[];
  groupDivider?: (data: any[], type: any) => any[];
  pinnable?: boolean;
  selectable?: boolean;
  editableItem?: boolean;
  navigateTo?: string;
  checkboxOnly?: boolean;
}

@Component({
  selector: 'app-base-list',
  templateUrl: 'base-list.component.html',
  styleUrls: ['base-list.component.scss']
})
export class BaseListComponent<T> implements OnInit, OnChanges {
  @Input() listName: string;
  @Input() dataList: T[] = [];
  @Input() config: IListConfig;
  @Output() itemClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemAction: EventEmitter<IListItemAction> = new EventEmitter<IListItemAction>();
  @ContentChild('customTemplate') customTemplate: TemplateRef<any>;


  filteredList: any[] = [];
  groupDivider: (data: any[], type: any) => any[];
  groupedList: BaseGroupList<IListItem<T>>;

  async ngOnInit(): Promise<void> {
    this.groupedList = new BaseGroupList<IListItem<T>>(this.listName);
    this.groupDivider = this.config.groupDivider ? this.config.groupDivider : this.groupDivider;
    this.refresh();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (!this.groupedList) { return; }

    this.dataList = changes['dataList'].currentValue;
    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!!this.groupDivider) {
      await this.divideOnGroups();
    }
    if (this.config.pinnable) {
      this.groupedList.fillPinnedGroup();
    }
  }

  async divideOnGroups(): Promise<void> {
    this.groupedList.clear();
    if (this.config.groups && this.config.groups.length && this.config.groupDivider) {
      this.config.groups.forEach(group => {
        const groupInst = new BaseListOfGroup<IListItem<T>>(group.name);
        const filteredGroupData = this.groupDivider(this.dataList, group.type);
        filteredGroupData.map(item => {
          groupInst.insertTo(this.getMappedItem(item));
        });
        this.groupedList.addGroup(groupInst);
      });
    }
    else {
      const groupInst = new BaseListOfGroup<IListItem<T>>('');
      this.dataList.forEach(item => {
        groupInst.insertTo(this.getMappedItem(item));
      });
      this.groupedList.addGroup(groupInst);
    }
  }

  private getMappedItem(item: any): IListItem<T> {
    const dataItem: IListItem<T> = {
      id: item.id,
      data: item,
      fields: [],
    };
    this.config.listDescription.map((listDesc: IListItemFieldDescription) => {
      dataItem?.fields?.push({
        value: listDesc.valueGetter ? listDesc.valueGetter(item) : item[listDesc.field],
        ...listDesc
      });
      if (item?.pinned) {
        dataItem.pinned = item.pinned;
      }
    });
    return dataItem;
  }

  onItemClicked(item: IListItem<T>): void {
    this.itemClicked.emit(item.id);
    console.log(item)
  }

  onItemAction(id: number, action: ListItemOption): void {
    this.itemAction.emit({id, action});
  }

  onKeyBoardEvent(event: KeyboardEvent): void {
    // TODO: handle keyboardEvent
  }

  copy(): void {}

  move(): void {}
}



export class BaseListOfGroup<T> {
  private _list: IListItem<T>[] = [];
  private _name: string;
  readonly _id: string;
  private _expanded: boolean = false;
  private _childCount: number = 0;


  constructor(name: string, items: any = [], expanded: boolean = true) {
    this._name = name;
    this._list = items;
    this._id = nanoid();
    this.expanded = expanded;
  };

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public insertTo(item: IListItem<T>, position?: number): void {
    if (position) {
      this._list.splice(position, 0, item);
    }
    else {
      this._list.push(item);
    }
    this.recalculatePositions();
  }

  public get childCount(): number {
    return this._childCount;
  }

  public remove(item: IListItem<T>): void {
    this._list = this.list.filter(i => item.id !== i.id);
  }

  public get list(): IListItem<T>[] {
    return this._list;
  }

  public get id(): string {
    return this._id;
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

export class BaseGroupList<T> {
  private _list: BaseListOfGroup<T>[] = [];
  private _name: string;
  readonly _pinnedRows: BaseListOfGroup<T>;

  constructor(name: string, items: BaseListOfGroup<T>[] = []) {
    this._name = name;
    this._list = items;
    this._pinnedRows = new BaseListOfGroup<T>('Pinned');
  };

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public addGroup(group: BaseListOfGroup<T>): void {
    this._list.push(group);
  }

  public get list(): BaseListOfGroup<T>[] {
    return this._list;
  }

  public pin(groupId: string, item: IListItem<T>): void {
    this._pinnedRows.insertTo(item);
    this._list.map(group => {
      if (group._id === groupId) {
        group.remove(item);
      }
    });
  }

  public unpin(groupId: string, item: IListItem<T>): void {
    this._pinnedRows.remove(item);
    this._list.map(group => {
      if (group._id === groupId) {
        group.insertTo(item);
      }
    });
  }

  public removeGroup(id: string): void {
    this._list = this._list.filter(g => g.id !== id);
  }

  public get pinnedGroup(): BaseListOfGroup<T> {
    return this._pinnedRows;
  }

  public clear(): void {
    this._list = [];
  }

  public fillPinnedGroup(): void {
    this._list.map(group => {
      group.list.map(item => {
        if (item.pinned) {
          this._pinnedRows.insertTo(item);
        }
      });
      this._pinnedRows.list.forEach(item => {
        group.remove(item);
      });
    })
  }
}

export enum InsertListItem {
  BEFORE,
  AFTER
}

export interface IListItemAction {
  id: number;
  action: ListItemOption;
}

export enum ListItemOption {
  SELECT = 'selectTask',
  CHANGE_POSITION = 'changePosition',
  ADD_CHILD = 'addChild',
  PIN = 'pin',
  MOVE = 'move',
  COPY = 'copy',
  DELETE = 'delete',
  MOVE_TO_TRASH = 'moveToTrash',
  COPY_LINK = 'copyLink',
}

export interface IActionListItem<T> {
  name: string;
  action: T;
}
