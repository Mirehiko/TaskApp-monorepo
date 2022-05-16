import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';


export class MoveDto {
  @ApiProperty({example: '1', description: 'Id родительской ноды'})
  @IsNumber()
  parentId: number;

  @ApiProperty({example: '[2, 3, 34]', description: 'Ids дочерних нод'})
  @IsArray()
  childIds: number[];
}
