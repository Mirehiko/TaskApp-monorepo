import { Input, OnChanges, Output, SimpleChanges, EventEmitter, Component, OnInit } from '@angular/core';


export interface IBaseListGroup {
  group: IListGroup;
  list: any[];
}

export interface IListGroup {
  name: string;
  type: any;
}

export interface IListDescription {
  field: string;
  header?: String;
  valueGetter?: (params: any) => string;
  template?: string;
  hidden?: boolean;
}

export interface IListConfig {
  listDescription: IListDescription[];
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
  fields: string[];
  filteredList: any[] = [];
  groupDivider: (data: any[], type: any) => any[];

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
      await this.filtrateDataByDescribedFields();
    }
  }

  // private toggleEntityPinnedField(entity: any): void {
  //   entity.pinned = !entity.pinned;
  //   this.saveChanges(entity.id, entity.pinned);
  // }

  async filtrateDataByDescribedFields(): Promise<void> {
    this.groupedList.map(group => {
      group.list = group.list.map(entity => {
        const filteredItem: any = {};
        this.config.listDescription.map((listDesc: IListDescription) => {
          filteredItem[listDesc.field] = listDesc.valueGetter ? listDesc.valueGetter(entity) : entity[listDesc.field];
        });
        filteredItem['id'] = entity.id;
        // console.log(filteredItem)
        return filteredItem;
      });
      return group;
    });
  }

  async divideOnGroups(): Promise<void> {
    this.groupedList = [];
    if (this.config.groups && this.config.groups.length && this.config.groupDivider) {
      this.config.groups.forEach(group => {
        group = group as IListGroup;
        this.groupedList.push({
          group: group,
          list: this.groupDivider(this.dataList, group.type)
        });
      });
    }
    else {
      this.groupedList.push({
        group: { name: '', type: null },
        list: this.dataList
      });
    }
    console.log(this.groupedList)
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

