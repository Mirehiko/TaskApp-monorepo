import { RequestObjectWithId } from '../objectWithId';
import { PermissionRequestDto } from '../permission';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';


export class RoleRequestDto implements RequestObjectWithId {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  permissions: PermissionRequestDto[];
}
