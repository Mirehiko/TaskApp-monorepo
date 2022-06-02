import { IsArray, IsNumber, IsOptional } from 'class-validator';


export class MoveDto {
  @IsNumber()
  parentId: number;

  @IsArray()
  childIds: number[];
}
