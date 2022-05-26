import { GetParams, GetParamsData } from '../../../base-service';
import { ListBehaviorType, ListType } from '@finapp/app-common';


export interface ListGetParamsData extends GetParamsData {
  params: ListGetParams;
}

export interface ListGetParams extends GetParams {
  createdBy?: number[];
  listType?: ListType;
  archived?: boolean;
  isCommon?: ListBehaviorType;
}
