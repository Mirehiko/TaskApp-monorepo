import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { ListType } from "../../enums";
import { Expose } from "class-transformer";


export class ListResponseDto {
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
  @Expose()
  parent_id: number;

  @IsOptional()
  @Expose()
  children?: ListResponseDto[];

  @ApiProperty({example: 'simple tag', description: 'List description'})
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({example: 'folder', description: 'List type'})
  @IsOptional()
  @Expose()
  type?: ListType;
}
