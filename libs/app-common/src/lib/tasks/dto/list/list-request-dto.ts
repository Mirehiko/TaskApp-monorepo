import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ListType } from '../../enums';
import { ListBehaviorType } from '../../enums/list-behavior-type';


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

  @IsString()
  @IsOptional()
  type?: ListType;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsOptional()
  behavior_type?: ListBehaviorType;

  @IsOptional()
  archived?: boolean;
}
