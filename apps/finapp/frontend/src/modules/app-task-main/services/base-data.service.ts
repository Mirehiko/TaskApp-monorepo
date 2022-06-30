import { BehaviorSubject } from 'rxjs';
import { IListItem } from '../components/list-module/base-list.component';


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
