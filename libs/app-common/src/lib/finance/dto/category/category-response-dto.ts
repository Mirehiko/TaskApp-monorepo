import { IsNotEmpty, IsOptional } from "class-validator";
import { Expose } from "class-transformer";
import { BaseTreeDto, TreeEntityType } from '../../../common';


export class CategoryResponseDto extends BaseTreeDto {
  @Expose()
  id: number;

  @IsNotEmpty()
  @Expose()
  name: string;

  @IsOptional()
  @Expose()
  description?: string;

  @IsOptional()
  @Expose()
  icon?: string;

  @IsOptional()
  @Expose()
  color?: string;

  @IsNotEmpty()
  parent_id: number;

  @IsOptional()
  @Expose()
  children?: CategoryResponseDto[];

  @IsOptional()
  @Expose()
  archived?: boolean;

  @IsNotEmpty()
  @Expose()
  sortOrder: number;

  @IsNotEmpty()
  @Expose()
  type: TreeEntityType = TreeEntityType.DETAIL;
}
