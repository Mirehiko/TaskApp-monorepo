import { RoleRequestDto } from "../role/role-request-dto";


export class UserRolesDto {
  readonly userId: number;
  readonly roles: RoleRequestDto[];
  readonly replaceRoles?: boolean;
}
