import { IsObject, IsOptional, IsString } from 'class-validator';
import { TaskFilterType } from '../../enums';
import { ITaskFilterParams } from '../../interfaces';


export class TaskFilterRequestDto {
  @IsString()
  name: string;

  @IsOptional()
  type?: TaskFilterType = TaskFilterType.CUSTOM;

  @IsOptional()
  @IsObject()
  metadata?: ITaskFilterParams;
}
