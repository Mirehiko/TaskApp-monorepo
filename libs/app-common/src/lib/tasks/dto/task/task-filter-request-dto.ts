import { IsObject, IsOptional, IsString } from 'class-validator';
import { ITaskFilterParams, TaskFilterType } from '@finapp/app-common';


export class TaskFilterRequestDto {
  @IsString()
  name: string;

  @IsOptional()
  type?: TaskFilterType = TaskFilterType.CUSTOM;

  @IsOptional()
  @IsObject()
  metadata?: ITaskFilterParams;
}
