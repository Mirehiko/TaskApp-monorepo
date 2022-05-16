import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


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

	// @ApiProperty({ example: '2022.01.21', description: 'Список пользователей работающих над задачей'})
  // @Expose()
	// assignee?: User[];

	// @ApiProperty({ example: '2022.01.21', description: 'Список пользователей проверяющих задачю'})
  // @Expose()
  // reviewer?: User[];

	// @ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
  // @Expose()
	// createdBy: User;

	// @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
  // @Expose()
  // updatedBy: User;

	@ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
  @Expose()
	dateDue?: Date;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
  @Expose()
	status: string;

	// config
}
