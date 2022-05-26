import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from '../../../common';
import { TaskPriority, TaskStatus } from '../../enums';
import { TagResponseDto } from '../tag';


export class TaskResponseDto {
	@ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  	@Expose()
	id: number;

	@ApiProperty({example: 'Do homework', description: 'Task name'})
	@Expose()
	name: string;

	@ApiProperty({example: 'Description here', description: 'Описание задачи'})
  	@Expose()
	description?: string;

	@ApiProperty({example: 'file', description: 'Иконка задачи'})
  	@Expose()
	icon?: string;

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей работающих над задачей'})
	@Expose()
	assignee?: UserResponseDto;

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей проверяющих задачю'})
	@Expose()
	reviewer?: UserResponseDto;

	@ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
	@Expose()
	createdBy: UserResponseDto;

	@ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
	@Expose()
	tags: TagResponseDto[];

	@ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
	@Expose()
	updatedBy: UserResponseDto;

	@ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
  	@Expose()
	startDate?: Date;

	@ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
	@Expose()
  	endDate?: Date;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
	@Expose()
	status: TaskStatus;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
	@Expose()
	priority: TaskPriority;

	@ApiProperty({ example: 'none', description: 'Приоритет задачи'})
	@Expose()
	pinned?: boolean;
	// config
}
