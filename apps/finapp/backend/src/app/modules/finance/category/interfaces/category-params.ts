import { GetParams } from '../../../base-service';


export interface CategoryGetParams extends GetParams {
  createdBy?: number[];
}
