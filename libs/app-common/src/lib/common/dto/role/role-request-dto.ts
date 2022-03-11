import {ApiOperation, ApiProperty} from "@nestjs/swagger";
import { RequestObjectWithId } from '../objectWithId';
import { PermissionRequestDto } from '../permission';


export class RoleRequestDto implements RequestObjectWithId {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  id?: number;

  @ApiProperty({example: 'ADMIN', description: 'Уникальное название роли'})
  name: string;

  @ApiProperty({example: 'Administrator', description: 'Отображаемое имя роли'})
  displayName: string;

  @ApiProperty({example: 'Description here ....', description: 'Описание роли'})
  description?: string;

  @ApiProperty({example: 'Список разрешений', description: 'Список разрешений, которыми обладает роль'})
  permissions: PermissionRequestDto[];
}