import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TaskCommentResponseDto } from '../..';
import { UserResponseDto } from '../../../common';
import { TaskPriority, TaskStatus } from '../../enums';
import { TagResponseDto } from '../tag';


export class TaskResponseDto {
  @Expose()
	id: number;

	@Expose()
	name: string;

  @Expose()
  @IsOptional()
	description?: string;

  @Expose()
  @IsOptional()
	icon?: string;

	@Expose()
  @IsOptional()
	assignee?: UserResponseDto;

	@Expose()
  @IsOptional()
	reviewer?: UserResponseDto;

	@Expose()
  @IsOptional()
	createdBy: UserResponseDto;

	@Expose()
  @IsOptional()
	tags: TagResponseDto[];

	@Expose()
  @IsOptional()
	updatedBy: UserResponseDto;

  @Expose()
  @IsOptional()
	startDate?: Date;

	@Expose()
  @IsOptional()
  endDate?: Date;

	@Expose()
	status: TaskStatus;

	@Expose()
	priority: TaskPriority;

	@Expose()
  @IsOptional()
	pinned: boolean;
	// config

  @IsOptional()
  @Expose()
  comments?: TaskCommentResponseDto[];

  @IsOptional()
  @Expose()
  children?: TaskResponseDto[];
}
