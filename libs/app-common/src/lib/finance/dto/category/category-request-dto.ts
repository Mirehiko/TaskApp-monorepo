import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class CategoryRequestDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsEmail()
  @IsOptional()
  icon?: string;

  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;
}
