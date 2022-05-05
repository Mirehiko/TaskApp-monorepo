import {ApiOperation, ApiProperty} from "@nestjs/swagger";
import { RequestObjectWithId } from '../objectWithId';
import { PermissionRequestDto } from '../permission';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';


export class RoleRequestDto implements RequestObjectWithId {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({example: 'ADMIN', description: 'Уникальное название роли'})
  @IsString()
  name: string;

  @ApiProperty({example: 'Administrator', description: 'Отображаемое имя роли'})
  @IsString()
  displayName: string;

  @ApiProperty({example: 'Description here ....', description: 'Описание роли'})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({example: 'Список разрешений', description: 'Список разрешений, которыми обладает роль'})
  @IsArray()
  permissions: PermissionRequestDto[];
}
