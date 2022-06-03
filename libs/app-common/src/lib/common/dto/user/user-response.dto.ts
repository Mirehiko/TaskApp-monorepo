import { Exclude, Expose } from 'class-transformer';
import { RoleResponseDto } from '../role/role-response-dto';


@Exclude()
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

  @Expose()
  createdAt?: string;

  @Expose()
  updatedAt?: string;

  @Expose()
  suspendedAt?: Date = null;

  @Expose()
  suspendReason?: string = '';

  @Exclude()
  password?: string;
}
