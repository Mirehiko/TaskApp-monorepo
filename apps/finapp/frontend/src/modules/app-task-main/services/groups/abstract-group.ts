import { nanoid } from 'nanoid';
import { BehaviorSubject } from 'rxjs';

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
