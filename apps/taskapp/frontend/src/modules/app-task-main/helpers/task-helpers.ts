import { TaskResponseDto } from '@taskapp/app-common';
import { ITreeItem } from '../components/list-module/base-list.component';


class EntityTreeHelper<T> {
  public static async mapDtoToTree<T extends {id: number, children?: T[]}>(items: T[]): Promise<ITreeItem<T>[]> {
    return items.map(i => this._mapper(i));
  }

  protected static _mapper<T extends {id: number, children?: T[]}>(item: T): ITreeItem<T> {
    const dataItem: ITreeItem<T> = {
      id: item.id,
      data: item,
      children: [],
      isGroup: false,
    };
    if (item.children?.length) {
      item.children.forEach((child: T) => {
        dataItem.children.push(this._mapper(child));
      });
    }
    return dataItem;
  }
}

export class TaskTreeHelper extends EntityTreeHelper<TaskResponseDto> {
  _mapper(item: TaskResponseDto): ITreeItem<TaskResponseDto> {
    const dataItem: ITreeItem<TaskResponseDto> = {
      id: item.id,
      data: item,
      children: [],
      isGroup: false,
    };
    if (item?.pinned) {
      dataItem.pinned = item.pinned;
    }
    if (item.children?.length) {
      item.children.forEach((child: TaskResponseDto) => {
        dataItem.children.push(this._mapper(child));
      });
    }
    return dataItem;
  }
}
