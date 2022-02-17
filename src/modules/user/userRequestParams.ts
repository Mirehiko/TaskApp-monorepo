export interface UserRequestParams {
    withPermissions?: boolean;
    userGetParams: UserGetParams;
}

export interface UserGetParams {
    id?: number;
    email?: string;
    name?: string;
    roleId?: number;
    roleName?: string;
    checkOnly?: boolean;
}