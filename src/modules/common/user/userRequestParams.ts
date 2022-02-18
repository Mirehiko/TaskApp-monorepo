import { GetParams } from '../../base-service';


export interface UserRequestParams {
    withPermissions?: boolean;
    userGetParams: UserGetParams;
}

export interface UserGetParams extends GetParams {
    email?: string;
    roleId?: number;
    roleName?: string;
    checkOnly?: boolean;
}