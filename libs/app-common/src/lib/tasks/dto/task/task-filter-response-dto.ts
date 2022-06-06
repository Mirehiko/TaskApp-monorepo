import { ITaskFilterParams, TaskFilterType } from '@finapp/app-common';
import { Expose } from 'class-transformer';


@Expose()
export class TaskFilterResponseDto {
  name: string;
  type: TaskFilterType;
  metadata: ITaskFilterParams;
}
