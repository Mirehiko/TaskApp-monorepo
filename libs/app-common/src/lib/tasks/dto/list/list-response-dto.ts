import { IsNotEmpty, IsOptional } from "class-validator";
import { Expose } from "class-transformer";
import { BaseTreeDto, TreeEntityType } from '../../../common';


export class ListResponseDto {
  @Expose()
  id: number;

  @IsNotEmpty()
  @Expose()
  name: string;

  @IsOptional()
  @Expose()
  icon?: string;

  @IsOptional()
  @Expose()
  color?: string;

  @IsNotEmpty()
  @Expose()
  parent_id: number;

  @IsOptional()
  @Expose()
  children?: ListResponseDto[];

  @IsOptional()
  @Expose()
  description?: string;

  @Expose()
  archived?: boolean;

  @IsNotEmpty()
  @Expose()
  sortOrder: number;

  @IsNotEmpty()
  @Expose()
  type: TreeEntityType = TreeEntityType.DETAIL;
}
