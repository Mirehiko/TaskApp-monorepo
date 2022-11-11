import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TreeEntityType } from '../../../common';


export class TagRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNumber()
  @IsOptional()
  parent_id: number;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsOptional()
  sortOrder?: number;

  @IsNotEmpty()
  type: TreeEntityType = TreeEntityType.DETAIL;
}
