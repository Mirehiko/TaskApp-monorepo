import { IsNotEmpty, IsOptional } from "class-validator";
import { Expose } from "class-transformer";


export class TagResponseDto {
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
  parent_id: number;

  @IsOptional()
  @Expose()
  children?: TagResponseDto[];
}
