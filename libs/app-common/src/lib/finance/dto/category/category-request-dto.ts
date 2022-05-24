import { ApiProperty } from "@nestjs/swagger";
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

  @ApiProperty({example: '1234', description: 'Parent id'})
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({example: 'true', description: 'Parent id'})
  @IsBoolean()
  @IsOptional()
  archived?: boolean;
}
