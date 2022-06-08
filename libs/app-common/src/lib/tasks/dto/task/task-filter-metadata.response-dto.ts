import {
  IDateRange,
  ListResponseDto,
  TagResponseDto,
  TaskPriority,
  TaskStatus,
  UserResponseDto
} from '@finapp/app-common';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';


export class TaskFilterMetadataResponseDto {
  @Expose()
  @IsOptional()
  status?: TaskStatus[];

  @Expose()
  @IsOptional()
  name?: string;

  @Expose()
  @IsOptional()
  assignee?: UserResponseDto[];

  @Expose()
  @IsOptional()
  reviewer?: UserResponseDto[];

  @Expose()
  @IsOptional()
  createdBy?: UserResponseDto[];

  @Expose()
  @IsOptional()
  updatedBy?: UserResponseDto[];

  @Expose()
  @IsOptional()
  createdAt?: any;

  @Expose()
  @IsOptional()
  priority?: TaskPriority[];

  @Expose()
  @IsOptional()
  dates?: IDateRange;

  @Expose()
  @IsOptional()
  pinned?: boolean;

  @Expose()
  @IsOptional()
  tags?: TagResponseDto[];

  @Expose()
  @IsOptional()
  list?: ListResponseDto[];
}
