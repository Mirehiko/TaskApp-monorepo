import { GetParams } from '../../../base-service';


export interface TagGetParams extends GetParams {
  createdBy?: number[];
}
