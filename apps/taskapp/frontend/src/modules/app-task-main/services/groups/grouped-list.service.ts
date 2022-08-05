import { IListItem } from '../../components/list-module/base-list.component';
import { BaseGroupList } from './group-list';
import { AbstractGroupedList, IBaseGroupedData } from './abstract-group';


export interface IBaseGroupedListData<T> extends IBaseGroupedData<BaseGroupList<T>>{}

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
