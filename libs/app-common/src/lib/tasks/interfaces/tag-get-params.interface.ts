import { IGetParams } from '@finapp/app-common';


export interface ITagGetParams extends IGetParams {
  createdBy?: number[];
}
