import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { RequestObjectWithId } from '../../../common';
import { TaskPriority, TaskStatus } from '../../enums';


export class TaskRequestDto implements RequestObjectWithId {
	@ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @IsOptional()
  @IsNumber()
	id?: number;

	@ApiProperty({example: 'Do homework', description: 'Task name'})
  @IsString()
	name: string;

	@ApiProperty({example: 'Description here', description: 'Описание задачи'})
  @IsString()
  @IsOptional()
	description?: string = '';

	@ApiProperty({example: 'file', description: 'Иконка задачи'})
  @IsString()
  @IsOptional()
	icon?: string = '';

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей работающих над задачей'})
  @IsOptional()
	assignee?: number;

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей проверяющих задачю'})
  @IsOptional()
	reviewer?: number;

  @ApiProperty({ example: '2022.01.21', description: 'Список тегов'})
  @IsOptional()
  tags?: number[];

  @ApiProperty({ example: '2022.01.21', description: 'Список списков'})
  @IsOptional()
  list?: number;

	@ApiProperty({description: 'Id родительской ноды'})
  @IsNumber()
  @IsOptional()
  parent_id?: number = -1;

  @ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
  @IsOptional()
  endDate?: string;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
  @IsString()
  @IsOptional()
	status?: TaskStatus;

  @ApiProperty({ example: 'none', description: 'Приоритет задачи'})
  @IsString()
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: 'none', description: 'Приоритет задачи'})
  @IsString()
  @IsOptional()
  pinned?: boolean;
}
