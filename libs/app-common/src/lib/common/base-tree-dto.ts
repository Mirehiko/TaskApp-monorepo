import { Expose } from 'class-transformer';
import { TreeEntityType } from './tree-entity-type';


export class BaseTreeDto {
  id: number;
  children?: any;

  @Expose()
  sortOrder: number;

  @Expose()
  parent_id: number;

  @Expose()
  type: TreeEntityType;
}
