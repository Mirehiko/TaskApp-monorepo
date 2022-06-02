import { RoleResponseDto } from '@finapp/app-common';
import { Expose } from 'class-transformer';


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
