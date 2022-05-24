import { GetParams } from '../../../base-service';
import { ListType } from '@finapp/app-common';


export interface TagGetParams extends GetParams {
  createdBy?: number[];
  listType?: ListType;
}
