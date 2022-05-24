import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from "class-transformer";


export class TagResponseDto {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Expose()
  id: number;

  @ApiProperty({example: 'simple tag', description: 'Tag name'})
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsOptional()
  @Expose()
  icon?: string;

  @ApiProperty({example: '#fff', description: 'Tag color'})
  @IsOptional()
  @Expose()
  color?: string;

  @IsNotEmpty()
  parent_id: number;

  @IsOptional()
  @Expose()
  children?: TagResponseDto[];
}
