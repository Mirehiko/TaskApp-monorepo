import { TaskFilterType } from '@finapp/app-common';
import { Expose } from 'class-transformer';
import { TaskFilterMetadataResponseDto } from './task-filter-metadata.response-dto';


export class TaskFilterResponseDto {
  @Expose()
  name: string;

  @Expose()
  type: TaskFilterType;

  @Expose()
  metadata: TaskFilterMetadataResponseDto;
}
