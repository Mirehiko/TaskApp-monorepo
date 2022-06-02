import { PermissionResponseDto } from '../permission';
import { Expose } from 'class-transformer';


export class RoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  displayName: string;

  @Expose()
  description: string;

  @Expose()
  permissions: PermissionResponseDto[];
}
