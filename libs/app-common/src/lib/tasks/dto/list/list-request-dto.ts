import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ListBehaviorType } from '../../enums/list-behavior-type';
import { TreeEntityType } from '../../../common';


export class ListRequestDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsOptional()
  behavior_type?: ListBehaviorType;

  @IsOptional()
  archived?: boolean;

  @IsOptional()
  sortOrder?: number;

  @IsNotEmpty()
  type: TreeEntityType = TreeEntityType.DETAIL;
}
