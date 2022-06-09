import { IsNumber, IsOptional, IsString } from 'class-validator';
import { RequestObjectWithId } from '../../../common';
import { TaskPriority, TaskStatus } from '../../enums';


export class TaskRequestDto implements RequestObjectWithId {
  @IsOptional()
  @IsNumber()
	id?: number;

  @IsOptional()
  @IsString()
	name?: string;

  @IsString()
  @IsOptional()
	description?: string = '';

  @IsString()
  @IsOptional()
	icon?: string = '';

  @IsOptional()
	assignee?: number;

  @IsOptional()
	reviewer?: number;

  @IsOptional()
  tags?: number[];

  @IsOptional()
  list?: number;

  @IsNumber()
  @IsOptional()
  parent_id?: number = -1;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
	status?: TaskStatus;

  @IsString()
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  pinned?: boolean;
}
