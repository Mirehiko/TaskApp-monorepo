import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListType } from '../../enums';


export class ListRequestDto {

  @ApiProperty({example: 'simple tag', description: 'List name'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({example: 'simple tag', description: 'List description'})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({example: 'home', description: 'List icon'})
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({example: '#fff', description: 'List color'})
  @IsOptional()
  @IsString()
  color?: string;
  
  @ApiProperty({example: 'folder', description: 'List type'})
  @IsString()
  @IsOptional()
  type?: ListType;

  @ApiProperty({example: '1234', description: 'Parent id'})
  @IsOptional()
  @IsNumber()
  parent_id: number;
}
