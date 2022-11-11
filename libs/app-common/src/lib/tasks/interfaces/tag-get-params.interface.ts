import { IGetParams } from '@taskapp/app-common';


export interface ITagGetParams extends IGetParams {
  createdBy?: number[];
}
