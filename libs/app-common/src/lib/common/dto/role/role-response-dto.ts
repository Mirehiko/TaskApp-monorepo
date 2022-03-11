import {ApiOperation, ApiProperty} from "@nestjs/swagger";
import { PermissionResponseDto } from '../permission';
import { Expose } from 'class-transformer';


export class RoleResponseDto {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Expose()
  id: number;

  @ApiProperty({example: 'ADMIN', description: 'Уникальное название роли'})
  @Expose()
  name: string;

  @ApiProperty({example: 'Administrator', description: 'Отображаемое имя роли'})
  @Expose()
  displayName: string;

  @ApiProperty({example: 'Description here ....', description: 'Описание роли'})
  @Expose()
  description: string;

  @ApiProperty({example: 'Список разрешений', description: 'Список разрешений, которыми обладает роль'})
  @Expose()
  permissions: PermissionResponseDto[];
}
