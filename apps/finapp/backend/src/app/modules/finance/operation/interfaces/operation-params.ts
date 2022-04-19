import { GetParams, GetParamsData } from '../../../base-service';

export interface OperationGetParamsData extends GetParamsData {
  params: OperationGetParams;
}

export interface OperationGetParams extends GetParams {
  types?: string[];
  userIds?: number[];
  createdBy?: number[];
  updatedBy?: number[];
  status?: string[];
}
