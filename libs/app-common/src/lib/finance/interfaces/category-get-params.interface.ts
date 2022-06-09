import { IGetParams } from "../../common";


export interface ICategoryGetParams extends IGetParams {
  createdBy?: number[];
}
