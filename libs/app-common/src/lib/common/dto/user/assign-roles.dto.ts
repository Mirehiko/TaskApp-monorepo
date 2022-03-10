import { RoleRequestDto } from '@finapp/app-common';


export class UserRolesDto {
    readonly userId: number;
    readonly roles: RoleRequestDto[];
    readonly replaceRoles?: boolean;
}
