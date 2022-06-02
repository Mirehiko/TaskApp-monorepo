import { Expose } from 'class-transformer';
import { RoleResponseDto } from '../role/role-response-dto';


export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatar?: string;

  @Expose()
  roles: RoleResponseDto[];

  @Expose()
  status?: string;
}
