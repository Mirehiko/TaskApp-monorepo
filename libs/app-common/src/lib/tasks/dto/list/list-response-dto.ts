import { IsNotEmpty, IsOptional } from "class-validator";
import { ListType } from "../../enums";
import { Expose } from "class-transformer";


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
  type?: ListType;

  @Expose()
  archived?: boolean;
}
