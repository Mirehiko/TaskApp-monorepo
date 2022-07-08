import { Expose } from 'class-transformer';
import { TaskFilterMetadataResponseDto } from './task-filter-metadata.response-dto';
import { TaskFilterType } from '../../enums';


export class TaskFilterResponseDto {
  @Expose()
  name: string;

  @Expose()
  type: TaskFilterType;

  @Expose()
  metadata: TaskFilterMetadataResponseDto;
}
