import { ApiProperty } from '@nestjs/swagger';
import { RequestObjectWithId, TaskStates } from '@finapp/app-common';
import { IsNumber, IsOptional, IsString } from 'class-validator';


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
	assignee?: number[];

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей проверяющих задачю'})
	reviewer?: number;

  @ApiProperty({ example: '2022.01.21', description: 'Список тегов'})
  tags?: number[];

  @ApiProperty({ example: '2022.01.21', description: 'Список списков'})
  lists?: number[];

	@ApiProperty({description: 'Id родительской ноды'})
  @IsNumber()
  parent_id?: number = -1;

	@ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
	dateDue?: Date = null;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
  @IsString()
	status?: TaskStates;
}
