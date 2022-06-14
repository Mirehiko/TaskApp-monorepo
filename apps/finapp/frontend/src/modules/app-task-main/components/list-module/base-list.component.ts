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


export interface IBaseListGroup {
  group: IListGroup;
  list: any[];
  // list: IDataList[];
}

export interface IListGroup {
  name: string;
  type: any;
}

interface IListItemFieldDescription {
  field: string;
  header?: String;
  valueGetter?: (params: any) => string;
  template?: string;
  hidden?: boolean;
}

interface IListItemField extends IListItemFieldDescription {
  value: any;
}

export interface IListItem {
  id: number;
  fields: IListItemField[];
  data: any;
  pinned?: boolean;
  position?: number;
  children?: IListItem[];
}

export interface IListConfig {
  listDescription: IListItemFieldDescription[];
  groups?: IListGroup[];
  groupDivider?: (data: any[], type: any) => any[];
  pinnable?: boolean;
  selectable?: boolean;
  editableItem?: boolean;
}

@Component({
  selector: 'app-base-list',
  templateUrl: 'base-list.component.html',
  styleUrls: ['base-list.component.scss']
})
export class BaseListComponent implements OnInit, OnChanges {
  @Input() listName: string;
  @Input() dataList: any[] = [];
  @Input() config: IListConfig;
  @Output() itemClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemAction: EventEmitter<IListItemAction> = new EventEmitter<IListItemAction>();
  @ContentChild('customTemplate') customTemplate: TemplateRef<any>;


  filteredList: any[] = [];
  groupDivider: (data: any[], type: any) => any[];
  groupedList: BaseGroupList = new BaseGroupList('Tasks');

  async ngOnInit(): Promise<void> {
    this.groupDivider = this.config.groupDivider ? this.config.groupDivider : this.groupDivider;
    this.refresh();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.dataList = changes['dataList'].currentValue;
    this.refresh();
    this.groupedList.list.map(g => {
      g.setItemPosition(100,1);
    });
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
        const groupInst = new BaseListGroup(group.name);
        const filteredGroupData = this.groupDivider(this.dataList, group.type);
        filteredGroupData.map(item => {
          groupInst.insertTo(this.getMappedItem(item));
        });
        this.groupedList.addGroup(groupInst);
      });
    }
    else {
      const groupInst = new BaseListGroup('');
      this.dataList.forEach(item => {
        groupInst.insertTo(this.getMappedItem(item));
      });
      this.groupedList.addGroup(groupInst);
    }
  }

  private getMappedItem(item: any): IListItem {
    const dataItem: IListItem = {
      id: item.id,
      data: item,
      fields: []
    };
    this.config.listDescription.map((listDesc: IListItemFieldDescription) => {
      dataItem.fields.push({
        value: listDesc.valueGetter ? listDesc.valueGetter(item) : item[listDesc.field],
        ...listDesc
      });
      if (item?.pinned) {
        dataItem.pinned = item.pinned;
      }
      if (item?.children?.length) {
        dataItem.children = [];
        item.children.map((child: any) => {
          dataItem.children?.push(this.getMappedItem(child));
        });
      }
    });
    return dataItem;
  }

  onItemClicked(item: IListItem): void {
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



class BaseListGroup {
  private _list: IListItem[] = [];
  private _name: string;
  readonly _id: string;

  constructor(name: string, items: any = []) {
    this._name = name;
    this._list = items;
    this._id = nanoid();
  };

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public insertTo(item: any, position?: number): void {
    if (position) {
      this._list.splice(position, 0, item);
    }
    else {
      this._list.push(item);
    }
    this.recalculatePositions();
  }

  public remove(item: IListItem): void {
    this._list = this.list.filter(i => item.id !== i.id);
  }

  public get list(): IListItem[] {
    return this._list;
  }

  public get id(): string {
    return this._id;
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
  }

}

class BaseGroupList {
  private _list: BaseListGroup[] = [];
  private _name: string;
  private _pinnedRows: BaseListGroup;

  constructor(name: string, items: any = []) {
    this._name = name;
    this._list = items;
    this._pinnedRows = new BaseListGroup('Pinned');
  };

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public addGroup(group: BaseListGroup): void {
    this._list.push(group);
  }

  public get list(): BaseListGroup[] {
    return this._list;
  }

  public pin(groupId: string, item: IListItem): void {
    this._pinnedRows.insertTo(item);
    this._list.map(group => {
      if (group._id === groupId) {
        group.remove(item);
      }
    });
  }

  public unpin(groupId: string, item: IListItem): void {
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

  public get pinnedGroup(): BaseListGroup {
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
  SELECT_TASK = 'selectTask',
  CHANGE_POSITION = 'changePosition',
  ADD_CHILD = 'addChild',
  PIN = 'pin',
  MOVE = 'move',
  COPY = 'copy',
  DELETE = 'delete',
  MOVE_TO_TRASH = 'moveToTrash',
  COPY_LINK = 'copyLink',
  CONVERT_TO_TEXT = 'convertToText',
  CONVERT_TO_TASK = 'convertToTask',
}

