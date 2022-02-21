import { GetParams, GetParamsData } from '../../../base-service';


export interface UserRequestParams {
	withPermissions?: boolean;
	userGetParams: UserGetParams;
}

export interface UserGetParamsData extends GetParamsData {
	params: UserGetParams;
}

export interface UserGetParams extends GetParams {
	email?: string;
	roleId?: number;
	roleName?: string;
	checkOnly?: boolean;
}