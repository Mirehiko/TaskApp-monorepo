import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ListRequestDto {

  @ApiProperty({example: 'simple tag', description: 'List name'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({example: 'home', description: 'List icon'})
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({example: '#fff', description: 'List color'})
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({example: '1234', description: 'Parent id'})
  @IsNotEmpty()
  @IsNumber()
  parent_id: number;
}
