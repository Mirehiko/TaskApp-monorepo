import { IGetParams, IGetParamsData } from '../../common';
import { ListBehaviorType, ListType } from '../enums';


export interface IListGetParamsData extends IGetParamsData {
  params: IListGetParams;
}

export interface IListGetParams extends IGetParams {
  createdBy?: number[];
  listType?: ListType;
  archived?: boolean;
  isCommon?: ListBehaviorType;
}
