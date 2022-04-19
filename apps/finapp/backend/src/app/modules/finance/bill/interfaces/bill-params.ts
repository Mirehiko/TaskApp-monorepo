import { GetParams, GetParamsData } from '../../../base-service';

export interface BillGetParamsData extends GetParamsData {
  params: BillGetParams;
}

export interface BillGetParams extends GetParams {
  types?: string[];
  userIds?: number[];
  createdBy?: number[];
  updatedBy?: number[];
  status?: string[];
}
