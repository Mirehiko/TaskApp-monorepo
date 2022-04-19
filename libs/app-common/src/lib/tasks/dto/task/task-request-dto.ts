import { ApiProperty } from '@nestjs/swagger';
import { RequestObjectWithId } from '@finapp/app-common';


export class TaskRequestDto implements RequestObjectWithId {
	@ApiProperty({example: '1', description: 'Уникальный идентификатор'})
	id?: number;

	@ApiProperty({example: 'Do homework', description: 'Task name'})
	name?: string = '';

	@ApiProperty({example: 'Description here', description: 'Описание задачи'})
	description?: string;

	@ApiProperty({example: 'file', description: 'Иконка задачи'})
	icon?: string = '';

	// @ApiProperty({ example: '2022.01.21', description: 'Список пользователей работающих над задачей'})
	// assignee?: User[];

	// @ApiProperty({ example: '2022.01.21', description: 'Список пользователей проверяющих задачю'})
	// reviewer?: User[];

	// @ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
	// createdBy?: User;

	// @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
	// updatedBy?: User;

	@ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
	dateDue?: Date = null;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
	status?: string;
}
