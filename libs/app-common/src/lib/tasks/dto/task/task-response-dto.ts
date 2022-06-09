import { Expose } from 'class-transformer';
import { UserResponseDto } from '../../../common';
import { TaskPriority, TaskStatus } from '../../enums';
import { TagResponseDto } from '../tag';
import { TaskCommentResponseDto } from './task-comment-response-dto';
import { IsOptional } from 'class-validator';


export class TaskResponseDto {
  @Expose()
	id: number;

	@Expose()
	name: string;

  @Expose()
	description?: string;

  @Expose()
	icon?: string;

	@Expose()
	assignee?: UserResponseDto;

	@Expose()
	reviewer?: UserResponseDto;

	@Expose()
	createdBy: UserResponseDto;

	@Expose()
	tags: TagResponseDto[];

	@Expose()
	updatedBy: UserResponseDto;

  @Expose()
	startDate?: Date;

	@Expose()
  endDate?: Date;

	@Expose()
	status: TaskStatus;

	@Expose()
	priority: TaskPriority;

	@Expose()
  @IsOptional()
	pinned: boolean;
	// config

  @Expose()
  comments?: TaskCommentResponseDto[];
}
