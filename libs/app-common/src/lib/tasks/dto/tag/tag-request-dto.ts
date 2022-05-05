import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class TagRequestDto {
  @ApiProperty({example: 'simple tag', description: 'Tag name'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({example: 'icon', description: 'Tag icon'})
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({example: '#fff', description: 'Tag color'})
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({example: '1234', description: 'Parent id'})
  @IsNotEmpty()
  @IsNumber()
  parent_id: number;
}
