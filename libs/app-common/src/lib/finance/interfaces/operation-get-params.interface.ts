import { IGetParams, IGetParamsData } from '../../common';


export interface IOperationGetParamsData extends IGetParamsData {
  params: IOperationGetParams;
}

export interface IOperationGetParams extends IGetParams {
  types?: string[];
  userIds?: number[];
  createdBy?: number[];
  updatedBy?: number[];
  status?: string[];
}
