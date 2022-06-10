import { Input, OnChanges, Output, SimpleChanges, EventEmitter, Component, OnInit } from '@angular/core';


export interface IBaseListGroup {
  group: IListGroup;
  list: any[];
  // list: IDataList[];
}

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

interface IListItemField extends IListItemFieldDescription {
  value: any;
}

interface IListItem {
  id: number;
  fields: IListItemField[];
  data: any;
}

export interface IListConfig {
  listDescription: IListItemFieldDescription[];
  groups?: IListGroup[];
  groupDivider?: (data: any[], type: any) => any[];
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

  groupedList: IBaseListGroup[] = [];
  filteredList: any[] = [];
  groupDivider: (data: any[], type: any) => any[];
  gl: BaseListGroup[];

  async ngOnInit(): Promise<void> {
    this.groupDivider = this.config.groupDivider ? this.config.groupDivider : this.groupDivider;
    this.refresh();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.dataList = changes['dataList'].currentValue;
    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!!this.groupDivider) {
      await this.divideOnGroups();
    }
  }

  // private toggleEntityPinnedField(entity: any): void {
  //   entity.pinned = !entity.pinned;
  //   this.saveChanges(entity.id, entity.pinned);
  // }

  async divideOnGroups(): Promise<void> {
    this.gl = [];
    if (this.config.groups && this.config.groups.length && this.config.groupDivider) {
      this.config.groups.forEach(group => {
        const groupInst = new BaseListGroup(group.name);
        const filteredData = this.groupDivider(this.dataList, group.type);

        filteredData.map(item => {
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
          });
          groupInst.add(dataItem);
        });
        this.gl.push(groupInst);
      });
    }
    else {
      const groupInst = new BaseListGroup('');
      this.dataList.forEach(item => {
        groupInst.add({id: item.id, fields: [], data: item});
      });
      this.gl.push(groupInst);
    }
  }

  onItemClicked(id: number): void {
    this.itemClicked.emit(id);
  }

  onItemAction(id: number, action: ListItemOption): void {
    this.itemAction.emit({id, action});
  }

  onKeyBoardEvent(event: KeyboardEvent): void {
    // TODO: handle keyboardEvent
  }

  copy(): void {}

  move(): void {}

  // insertItemTo(id: number, insertTo: InsertListItem, data: T[]): void {
  //
  // }
}

class BaseListGroup {
  private _list: IListItem[] = [];
  public name: string;

  constructor(name: string) {
    this.name = name;
  };

  changeGroupName(name: string): void {
    this.name = name;
  }

  add(item: any): void {
    this._list.push(item);
  }

  remove(item: IListItem): void {
    this._list = this.list.filter(i => item.id !== i.id);
  }

  get list(): IListItem[] {
    return this._list;
  }

  clear(): void {
    this._list = [];
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

