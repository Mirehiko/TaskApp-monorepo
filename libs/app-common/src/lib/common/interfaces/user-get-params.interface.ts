import { IGetParams, IGetParamsData } from '.';


export interface IUserGetParamsData extends IGetParamsData {
  params: IUserGetParams;
}

export interface IUserGetParams extends IGetParams {
  email?: string;
  roleId?: number;
  roleName?: string;
  checkOnly?: boolean;
}
