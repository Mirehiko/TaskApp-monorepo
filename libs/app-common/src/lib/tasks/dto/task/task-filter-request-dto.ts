import { IsString } from 'class-validator';
import { ITaskFilterParams, TaskFilterType } from '@finapp/app-common';


export class TaskFilterRequestDto {
  @IsString()
  name: string;

  type?: TaskFilterType = TaskFilterType.CUSTOM;

  metadata?: ITaskFilterParams;
}
