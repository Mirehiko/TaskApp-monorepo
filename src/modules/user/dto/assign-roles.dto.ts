import {RoleResponseDto} from "../../role/dto/role-response.dto";

export class UserRolesDto {
    readonly userId: number;
    readonly roles: RoleResponseDto[];
    readonly replaceRoles?: boolean;
}