import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class TagResponseDto {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  id: number;

  @IsNotEmpty()
  @ApiProperty({example: 'simple tag', description: 'Tag name'})
  name: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  @ApiProperty({example: '#fff', description: 'Tag color'})
  color?: string;

  @IsNotEmpty()
  parent_id: number;

  @IsOptional()
  children?: TagResponseDto[];
}
