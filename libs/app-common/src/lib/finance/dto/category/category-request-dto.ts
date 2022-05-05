import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CategoryRequestDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsEmail()
  @IsNotEmpty()
  icon?: string;

  @IsOptional()
  @IsNotEmpty()
  color?: string;
}
