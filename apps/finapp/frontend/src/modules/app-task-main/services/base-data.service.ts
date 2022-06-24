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
  public insertItem(parent: T | null, items: T[]): void {
  }

  /**
   * Save new item
   * @param item
   */
  public updateItem(node: T, name: string): void {
  }

  public removeItem(node: T): void {

  }
}

export class BaseDataChildrenService<T> extends BaseDataService<IListItem<T>> {
  constructor() {
    super();
  }

  /**
   * Add new item
   * @param parent
   * @param item
   */
  public override insertItem(parent: IListItem<T> | null, items: IListItem<T>[]): void {
    if (!parent) {
      items.forEach(item => {
        this._dataChange.value.push(item);
      });
    }
    else {
      if (!parent.children) {
        parent.children = [];
      }

      items.forEach(item => {
        parent?.children?.push(item);
      });
    }

    this._dataChange.next(this.data);
  }

  /**
   * Save new item
   * @param item
   */
  public override updateItem(node: IListItem<T>, name: string): void {
    node.data.name = name;
    this._dataChange.next(this.data);
  }
}
