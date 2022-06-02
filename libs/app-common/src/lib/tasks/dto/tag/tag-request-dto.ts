import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


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
}
