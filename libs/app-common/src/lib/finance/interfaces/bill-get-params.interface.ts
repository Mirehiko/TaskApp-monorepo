import { IGetParams, IGetParamsData } from '../../common';


export interface IBillGetParamsData extends IGetParamsData {
  params: IBillGetParams;
}

export interface IBillGetParams extends IGetParams {
  types?: string[];
  userIds?: number[];
  createdBy?: number[];
  updatedBy?: number[];
  status?: string[];
}
